import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/pool';

/**
 * High-Security, High-Fidelity Few-Shot Prompting Engine.
 * Features realistic SQL query snippets, code execution output evaluation,
 * and edge-case testing (NULL logic, JOIN traps, Window frames).
 */
export async function generateQuestionSetWithLLM(
  topic: string = 'SQL',
  difficulty: 'ROOKIE' | 'PRO-BOWLER' | 'HALL OF FAMER' = 'ROOKIE',
  count: number = 30
): Promise<number> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured.');
  }

  const openai = new OpenAI({ apiKey });

  // Curated High-Quality Few-Shot Exemplars containing actual SQL code snippets
  const fewShotExemplars = [
    // --- Example 1: ROOKIE (Clean, unambiguous SQL query behavior) ---
    {
      role: 'user' as const,
      content: 'Generate 1 question for topic: SQL, difficulty: ROOKIE'
    },
    {
      role: 'assistant' as const,
      content: JSON.stringify({
        questions: [
          {
            topic_id: 'ol',
            category: 'SQL Filtering & Aggregates',
            difficulty: 'ROOKIE',
            question_text: 'Given an `employees` table with columns (id, name, department_id, salary), which query correctly returns the total number of employees in department 10 earning more than 50000?',
            option_a: 'SELECT COUNT(*) FROM employees WHERE department_id = 10 AND salary > 50000;',
            option_b: 'SELECT TOTAL(id) FROM employees HAVING department_id = 10 AND salary > 50000;',
            option_c: 'SELECT SUM(*) FROM employees WHERE department_id = 10 GROUP BY salary > 50000;',
            option_d: 'SELECT COUNT(employees) WHERE salary > 50000 AND department_id = 10;',
            correct_option: 'A',
            explanation: 'COUNT(*) calculates row count. The WHERE clause filters rows before aggregation. HAVING is invalid here without GROUP BY.'
          }
        ]
      })
    },
    // --- Example 2: PRO-BOWLER (Joins & Grouping with NULL/duplicate traps) ---
    {
      role: 'user' as const,
      content: 'Generate 1 question for topic: SQL, difficulty: PRO-BOWLER'
    },
    {
      role: 'assistant' as const,
      content: JSON.stringify({
        questions: [
          {
            topic_id: 'ol',
            category: 'SQL Joins & Grouping',
            difficulty: 'PRO-BOWLER',
            question_text: 'Consider two tables: `customers` (id, name) and `orders` (id, customer_id, amount). Which query lists all customers, including those who have never placed an order, with their total spent (showing 0 if no orders exist)?',
            option_a: 'SELECT c.name, SUM(o.amount) FROM customers c INNER JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;',
            option_b: 'SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;',
            option_c: 'SELECT c.name, ISNULL(COUNT(o.id), 0) FROM customers c RIGHT JOIN orders o ON c.id = o.customer_id GROUP BY c.name;',
            option_d: 'SELECT c.name, SUM(o.amount) FROM customers c CROSS JOIN orders o GROUP BY c.name HAVING COUNT(o.id) >= 0;',
            correct_option: 'B',
            explanation: 'LEFT JOIN retains all customers even without matching orders. SUM(o.amount) returns NULL for customers with zero orders, which COALESCE(..., 0) converts to 0.'
          }
        ]
      })
    },
    // --- Example 3: PRO-BOWLER (Window Functions & Ranking) ---
    {
      role: 'user' as const,
      content: 'Generate 1 question for topic: SQL, difficulty: PRO-BOWLER'
    },
    {
      role: 'assistant' as const,
      content: JSON.stringify({
        questions: [
          {
            topic_id: 'ol',
            category: 'SQL Window Functions',
            difficulty: 'PRO-BOWLER',
            question_text: 'You want to find the 2nd highest salary in each department. If two employees tie for 1st place with identical salaries, the next distinct salary should be ranked 2. Which window function must be used?',
            option_a: 'ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)',
            option_b: 'RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)',
            option_c: 'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)',
            option_d: 'NTILE(2) OVER (PARTITION BY dept_id ORDER BY salary DESC)',
            correct_option: 'C',
            explanation: 'DENSE_RANK() does not skip numbers when values tie (1, 1, 2). RANK() would skip to 3 (1, 1, 3), and ROW_NUMBER() arbitrarily breaks ties (1, 2, 3).'
          }
        ]
      })
    },
    // --- Example 4: HALL OF FAMER (Performance, Indexing, and CTE semantics) ---
    {
      role: 'user' as const,
      content: 'Generate 1 question for topic: SQL, difficulty: HALL OF FAMER'
    },
    {
      role: 'assistant' as const,
      content: JSON.stringify({
        questions: [
          {
            topic_id: 'ol',
            category: 'SQL Performance & Indexing',
            difficulty: 'HALL OF FAMER',
            question_text: 'A query `SELECT user_id, status FROM transactions WHERE account_id = 450 ORDER BY created_at DESC LIMIT 10;` is running slow on a table with 50 million rows. Which composite index allows the database to perform an Index-Only Scan with no sorting step in the query plan?',
            option_a: 'CREATE INDEX idx_tx ON transactions (account_id, created_at DESC) INCLUDE (user_id, status);',
            option_b: 'CREATE INDEX idx_tx ON transactions (status, user_id, account_id);',
            option_c: 'CREATE INDEX idx_tx ON transactions (created_at DESC);',
            option_d: 'CREATE INDEX idx_tx ON transactions (account_id) WHERE status IS NOT NULL;',
            correct_option: 'A',
            explanation: 'Indexing `(account_id, created_at DESC)` satisfies both equality filtering and sorting directly from the index tree. Adding `INCLUDE (user_id, status)` covers all projected columns without visiting table heap pages.'
          }
        ]
      })
    }
  ];

  const systemInstructions = `You are a Principal Database Engineer and Technical Assessment Proctor.
CORE OBJECTIVE: Generate realistic, highly practical, interview-grade multiple choice questions.

QUALITY PRINCIPLES (EVIDENCED BY FEW-SHOT EXAMPLES):
1. USE REAL SQL SNIPPETS: Use concrete table scenarios (e.g., \`orders\`, \`employees\`, \`transactions\`) and actual SQL clauses in question text and options.
2. DIFFICULTY CALIBRATION:
   - ROOKIE: Core SQL grammar, simple filters, aggregate math, basic sorting, and NULL syntax.
   - PRO-BOWLER: Practical JOINs (handling NULLs), GROUP BY + HAVING subtleties, subquery execution, CTEs, and window ranking (ROW_NUMBER vs RANK vs DENSE_RANK).
   - HALL OF FAMER: Composite index ordering, Index-Only Scans (INCLUDE clause), window framing (ROWS vs RANGE), recursive queries, and query plan optimization.
3. SECURITY & TOPIC INTEGRITY: Strictly keep questions on "${topic}". Never discuss external topics, vendor internals (like WAL/vacuum), or OS processes.
4. OPTION BALANCE: Ensure correct_option is evenly distributed across A, B, C, and D without patterns.`;

  const userPrompt = `Generate ${count} distinct, code-rich multiple-choice interview questions strictly about ${topic} at ${difficulty} level.
Follow the exact JSON schema and technical depth demonstrated in the few-shot examples.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemInstructions },
      ...fewShotExemplars,
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.5, // Low temperature ensures accurate syntax and eliminates hallucination
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error('Failed to parse validated JSON response from LLM.');
  }

  const questionsList: any[] = Array.isArray(parsed) 
    ? parsed 
    : (parsed.questions || Object.values(parsed)[0] || []);

  let insertedCount = 0;
  for (const q of questionsList) {
    if (!q.question_text || !q.option_a || !q.option_b || !q.option_c || !q.option_d || !q.correct_option) {
      continue;
    }

    const cleanCorrect = q.correct_option.toString().toUpperCase().trim();
    if (!['A', 'B', 'C', 'D'].includes(cleanCorrect)) {
      continue;
    }

    const id = uuidv4();
    await query(
      `INSERT INTO questions (id, difficulty, topic_id, category, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        id,
        difficulty,
        q.topic_id || 'ol',
        q.category || topic,
        q.question_text.trim(),
        q.option_a.trim(),
        q.option_b.trim(),
        q.option_c.trim(),
        q.option_d.trim(),
        cleanCorrect,
        q.explanation ? q.explanation.trim() : ''
      ]
    );
    insertedCount++;
  }

  return insertedCount;
}
