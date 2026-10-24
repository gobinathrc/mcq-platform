import { Router, Request, Response } from 'express';
import { generateQuestionSetWithLLM } from '../services/llmGenerator';
import { query } from '../db/pool';

const router = Router();

/**
 * Trigger LLM question generation to generate 150 questions across 5 difficulty/topic sets.
 * Stored directly in PostgreSQL so they are served instantly to all 70 examinees.
 */
router.post('/generate-sets', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic = 'SQL', sets = 5, questionsPerSet = 30 } = req.body;

    const difficulties: ('EASY' | 'MEDIUM' | 'HARD')[] = ['EASY', 'MEDIUM', 'HARD', 'MEDIUM', 'HARD'];
    const results: any[] = [];
    let totalGenerated = 0;

    for (let i = 0; i < Math.min(sets, 5); i++) {
      const diff = difficulties[i];
      try {
        const count = await generateQuestionSetWithLLM(topic, diff, questionsPerSet);
        totalGenerated += count;
        results.push({ set: i + 1, difficulty: diff, questionsGenerated: count });
      } catch (err: any) {
        results.push({ set: i + 1, difficulty: diff, error: err.message });
      }
    }

    res.json({
      message: `Generated ${totalGenerated} questions across sets using OpenAI`,
      totalGenerated,
      sets: results
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'LLM Generation failed' });
  }
});

/**
 * Get question bank stats
 */
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const total = await query('SELECT count(*) FROM questions');
    const byDiff = await query('SELECT difficulty, count(*) FROM questions GROUP BY difficulty');
    res.json({
      totalQuestions: Number(total.rows[0].count),
      distribution: byDiff.rows
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

export default router;
