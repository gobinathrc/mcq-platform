import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/pool';

/**
 * Service to dynamically generate sets of SQL interview questions using OpenAI LLM
 * Generates 150 questions across 5 sets (Easy, Medium, Hard, Window Functions, System Internals)
 * and persists them into PostgreSQL so examinees receive randomized, jumbled question sets.
 */
export async function generateQuestionSetWithLLM(
  topic: string = 'SQL',
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM',
  count: number = 30
): Promise<number> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured.');
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `Generate ${count} distinct multiple-choice interview questions about ${topic} at ${difficulty} difficulty level.
Return strictly a valid JSON array of objects. Do not include markdown code blocks or backticks.
Each object must have the exact structure:
{
  "category": "Topic subcategory (e.g. Window Functions, Joins, Indexing, ACID, Aggregations)",
  "difficulty": "${difficulty}",
  "question_text": "Clear technical question",
  "option_a": "Option A text",
  "option_b": "Option B text",
  "option_c": "Option C text",
  "option_d": "Option D text",
  "correct_option": "A" | "B" | "C" | "D",
  "explanation": "Detailed explanation of why the correct option is right and others are wrong"
}
Ensure an equal distribution of correct_option among A, B, C, and D.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a principal database engineer and interview assessor creating rigorous, error-free SQL multiple choice questions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error('Failed to parse JSON response from OpenAI');
  }

  const questionsList: any[] = Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed)[0] || []);

  let insertedCount = 0;
  for (const q of questionsList) {
    if (!q.question_text || !q.option_a || !q.correct_option) continue;

    const id = uuidv4();
    await query(
      `INSERT INTO questions (id, difficulty, category, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        id,
        q.difficulty || difficulty,
        q.category || topic,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option.toUpperCase().trim(),
        q.explanation || ''
      ]
    );
    insertedCount++;
  }

  return insertedCount;
}
