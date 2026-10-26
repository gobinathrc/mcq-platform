import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { query } from '../db/pool';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

/**
 * Fisher-Yates array shuffle helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Start a test session based on chosen Target Position (Topic) and Prospect Level (Difficulty).
 */
router.post('/start', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topicIdParam = (req.body.topicId || 'all').toLowerCase();
    const difficultyParam = (req.body.difficulty || 'ROOKIE').toUpperCase();
    const count = Number(req.body.count || 30);

    let querySql = `
      SELECT id, difficulty, topic_id, category, question_text, option_a, option_b, option_c, option_d, correct_option 
      FROM questions 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (topicIdParam !== 'all') {
      params.push(topicIdParam);
      querySql += ` AND topic_id = $${params.length}`;
    }

    if (['ROOKIE', 'PRO-BOWLER', 'HALL OF FAMER'].includes(difficultyParam)) {
      params.push(difficultyParam);
      querySql += ` AND difficulty = $${params.length}`;
    }

    querySql += ` ORDER BY RANDOM() LIMIT ${count}`;

    let questionsRes = await query(querySql, params);

    // If specific filter returned fewer than count, fallback to wider curriculum
    if (questionsRes.rows.length < count) {
      questionsRes = await query(
        `SELECT id, difficulty, topic_id, category, question_text, option_a, option_b, option_c, option_d, correct_option 
         FROM questions 
         ORDER BY RANDOM() 
         LIMIT $1`,
        [count]
      );
    }

    if (questionsRes.rows.length === 0) {
      res.status(404).json({ error: 'No questions available in question bank.' });
      return;
    }

    // Shuffle questions order for this student
    const shuffledQuestions = shuffleArray(questionsRes.rows);

    const sessionId = uuidv4();
    await query(
      `INSERT INTO test_sessions (id, user_id, difficulty, total_questions, status)
       VALUES ($1, $2, $3, $4, 'IN_PROGRESS')`,
      [sessionId, req.user!.userId, difficultyParam, shuffledQuestions.length]
    );

    // Prepare randomized options per examinee
    // Shuffles the 4 options so the correct answer is naturally randomized across A, B, C, and D for every candidate
    const questionsPayload = [];

    for (let index = 0; index < shuffledQuestions.length; index++) {
      const q = shuffledQuestions[index];

      // Option contents with their original key
      const rawOptions = [
        { origKey: 'A', text: q.option_a },
        { origKey: 'B', text: q.option_b },
        { origKey: 'C', text: q.option_c },
        { origKey: 'D', text: q.option_d },
      ];

      // Shuffle the 4 option texts randomly
      const randomizedOptions = shuffleArray(rawOptions);

      // Reassign keys A, B, C, D in their new randomized positions
      const newOptions = randomizedOptions.map((opt, i) => {
        const newKey = (['A', 'B', 'C', 'D'] as const)[i];
        return {
          key: newKey,
          text: opt.text,
          origKey: opt.origKey
        };
      });

      // Find which new randomized key corresponds to the true correct answer
      const mappedCorrectKey = newOptions.find(o => o.origKey === q.correct_option)?.key || 'A';

      // Record question in session_answers pre-mapped so submission can be scored instantly
      const answerRecordId = uuidv4();
      await query(
        `INSERT INTO session_answers (id, session_id, question_id, selected_option, is_correct)
         VALUES ($1, $2, $3, $4, FALSE)`,
        [answerRecordId, sessionId, q.id, mappedCorrectKey] // storing mapped key temporarily in selected_option column
      );

      questionsPayload.push({
        id: q.id,
        index: index + 1,
        topic_id: q.topic_id,
        category: q.category,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: newOptions.map(o => ({ key: o.key, text: o.text })) // Clean payload without origKey or correct answer
      });
    }

    res.status(201).json({
      sessionId,
      difficulty: difficultyParam,
      totalQuestions: questionsPayload.length,
      questions: questionsPayload
    });
  } catch (error: any) {
    console.error('Error starting test session:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate test session' });
  }
});

const submitSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedOption: z.enum(['A', 'B', 'C', 'D']).nullable()
    })
  )
});

/**
 * Submit answers, calculate score immediately and record candidate responses in PostgreSQL.
 */
router.post('/submit', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parse = submitSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors[0].message });
      return;
    }

    const { sessionId, answers } = parse.data;

    const sessionRes = await query(
      'SELECT id, user_id, difficulty, total_questions, status FROM test_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      res.status(404).json({ error: 'Test session not found' });
      return;
    }

    const session = sessionRes.rows[0];
    if (session.user_id !== req.user!.userId) {
      res.status(403).json({ error: 'Unauthorized to submit answers for this session' });
      return;
    }

    if (session.status === 'COMPLETED') {
      res.status(400).json({ error: 'This test session has already been completed and graded.' });
      return;
    }

    // Retrieve pre-mapped answers for this session
    const storedAnswersRes = await query(
      'SELECT id, question_id, selected_option FROM session_answers WHERE session_id = $1',
      [sessionId]
    );

    const correctMap = new Map<string, { recordId: string; correctKey: string }>();
    for (const row of storedAnswersRes.rows) {
      correctMap.set(row.question_id, {
        recordId: row.id,
        correctKey: row.selected_option // was stored as the mapped correct key
      });
    }

    let score = 0;

    for (const ans of answers) {
      const stored = correctMap.get(ans.questionId);
      if (!stored) continue;

      const isCorrect = ans.selectedOption !== null && ans.selectedOption === stored.correctKey;
      if (isCorrect) score += 1;

      // Update with candidate's actual choice and whether it was correct
      await query(
        `UPDATE session_answers 
         SET selected_option = $1, is_correct = $2 
         WHERE id = $3`,
        [ans.selectedOption, isCorrect, stored.recordId]
      );
    }

    const totalQuestions = session.total_questions || answers.length;
    const percentage = Number(((score / (totalQuestions || 1)) * 100).toFixed(2));

    await query(
      `UPDATE test_sessions 
       SET score = $1, percentage = $2, status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [score, percentage, sessionId]
    );

    // Return final grade only (No correct/wrong answers revealed)
    res.json({
      message: 'Test submitted and evaluated successfully',
      sessionId,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 60.0
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process test submission' });
  }
});

/**
 * Get user test history stats
 */
router.get('/history', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await query(
      `SELECT id, difficulty, total_questions, score, percentage, status, started_at, completed_at 
       FROM test_sessions 
       WHERE user_id = $1 AND status = 'COMPLETED' 
       ORDER BY completed_at DESC 
       LIMIT 10`,
      [req.user!.userId]
    );

    res.json({ sessions: history.rows });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve test history' });
  }
});

export default router;
