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
 * Start or retrieve a new test session.
 * Shuffles questions and option presentation per student to prevent copy/cheat.
 */
router.post('/start', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const difficultyParam = (req.body.difficulty || 'MEDIUM').toUpperCase();
    const count = Number(req.body.count || 30); // Requested 30 questions

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficultyParam)) {
      res.status(400).json({ error: 'Difficulty must be EASY, MEDIUM, or HARD' });
      return;
    }

    // Retrieve pool of questions for requested difficulty (or fallback to all if difficulty pool has fewer)
    let questionsRes = await query(
      `SELECT id, difficulty, category, question_text, option_a, option_b, option_c, option_d 
       FROM questions 
       WHERE difficulty = $1 
       ORDER BY RANDOM() 
       LIMIT $2`,
      [difficultyParam, count]
    );

    // If pool has fewer than requested, grab from adjacent difficulty to guarantee test size
    if (questionsRes.rows.length < count) {
      questionsRes = await query(
        `SELECT id, difficulty, category, question_text, option_a, option_b, option_c, option_d 
         FROM questions 
         ORDER BY (CASE WHEN difficulty = $1 THEN 0 ELSE 1 END), RANDOM() 
         LIMIT $2`,
        [difficultyParam, count]
      );
    }

    if (questionsRes.rows.length === 0) {
      res.status(404).json({ error: 'No questions available. Please run database seed.' });
      return;
    }

    // Shuffle questions order for this student
    const shuffledQuestions = shuffleArray(questionsRes.rows);

    // Create a new test session in DB
    const sessionId = uuidv4();
    await query(
      `INSERT INTO test_sessions (id, user_id, difficulty, total_questions, status)
       VALUES ($1, $2, $3, $4, 'IN_PROGRESS')`,
      [sessionId, req.user!.userId, difficultyParam, shuffledQuestions.length]
    );

    // Prepare response without correct_option to prevent inspect-element cheating
    const questionsPayload = shuffledQuestions.map((q, index) => {
      // Map 4 options into array and shuffle
      const originalOptions = [
        { key: 'A', text: q.option_a },
        { key: 'B', text: q.option_b },
        { key: 'C', text: q.option_c },
        { key: 'D', text: q.option_d },
      ];

      return {
        id: q.id,
        index: index + 1,
        category: q.category,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: originalOptions // { key: 'A'|'B'|'C'|'D', text: string }
      };
    });

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

    // Verify session belongs to user and is in progress
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

    // Retrieve correct answers and explanations for the submitted question IDs
    const questionIds = answers.map((a) => a.questionId);
    let questionsRes;
    if (questionIds.length === 0) {
      questionsRes = { rows: [] };
    } else {
      const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(',');
      questionsRes = await query(
        `SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation 
         FROM questions 
         WHERE id IN (${placeholders})`,
        questionIds
      );
    }

    const questionMap = new Map<string, any>();
    for (const q of questionsRes.rows) {
      questionMap.set(q.id, q);
    }

    let score = 0;
    const answerBreakdown: any[] = [];

    // Process and record each submitted answer
    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const isCorrect = ans.selectedOption === q.correct_option;
      if (isCorrect) score += 1;

      const answerRecordId = uuidv4();
      await query(
        `INSERT INTO session_answers (id, session_id, question_id, selected_option, is_correct)
         VALUES ($1, $2, $3, $4, $5)`,
        [answerRecordId, sessionId, ans.questionId, ans.selectedOption, isCorrect]
      );

      answerBreakdown.push({
        questionId: q.id,
        questionText: q.question_text,
        selectedOption: ans.selectedOption,
        correctOption: q.correct_option,
        isCorrect,
        explanation: q.explanation,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d,
        }
      });
    }

    const totalQuestions = session.total_questions || answers.length;
    const percentage = Number(((score / (totalQuestions || 1)) * 100).toFixed(2));

    // Mark session as COMPLETED and persist final score
    await query(
      `UPDATE test_sessions 
       SET score = $1, percentage = $2, status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [score, percentage, sessionId]
    );

    res.json({
      message: 'Test submitted and evaluated successfully',
      sessionId,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 60.0,
      breakdown: answerBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process test submission' });
  }
});

/**
 * Get user test history/leaderboard stats
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
