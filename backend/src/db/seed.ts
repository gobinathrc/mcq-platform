import { query } from './pool';
import { v4 as uuidv4 } from 'uuid';

export interface SeedQuestion {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

/**
 * 100% Pure Standard SQL Questions (No PostgreSQL internals or engine specifics).
 * Handcrafted to be crystal clear, beginner-friendly for Easy, and strictly focused on real SQL queries.
 * Perfectly balanced across A, B, C, D (25% each).
 */
export const PURE_SQL_QUESTIONS: SeedQuestion[] = [
  // ================= EASY LEVEL (True Beginner & Everyday SQL) =================
  // 1
  {
    difficulty: 'EASY',
    category: 'SQL Basics',
    question_text: 'Which SQL statement is used to extract data from a database table?',
    option_a: 'SELECT',
    option_b: 'EXTRACT',
    option_c: 'GET',
    option_d: 'OPEN',
    correct_option: 'A',
    explanation: 'SELECT is the fundamental SQL statement used to query and retrieve data from a table.'
  },
  // 2
  {
    difficulty: 'EASY',
    category: 'SQL Filtering',
    question_text: 'Which clause is used in SQL to filter rows and return only those that meet a specified condition?',
    option_a: 'ORDER BY',
    option_b: 'WHERE',
    option_c: 'GROUP BY',
    option_d: 'LIMIT',
    correct_option: 'B',
    explanation: 'The WHERE clause specifies search conditions to filter rows returned by a query.'
  },
  // 3
  {
    difficulty: 'EASY',
    category: 'SQL Queries',
    question_text: 'Which keyword eliminates duplicate rows from a query result set?',
    option_a: 'UNIQUE',
    option_b: 'DIFFERENT',
    option_c: 'DISTINCT',
    option_d: 'SINGLE',
    correct_option: 'C',
    explanation: 'SELECT DISTINCT returns only unique values across the specified columns.'
  },
  // 4
  {
    difficulty: 'EASY',
    category: 'SQL Sorting',
    question_text: 'Which keyword is used to sort query results in ascending order (lowest to highest)?',
    option_a: 'UP',
    option_b: 'ORDER',
    option_c: 'TOP',
    option_d: 'ASC',
    correct_option: 'D',
    explanation: 'ASC sorts results in ascending order. (e.g. ORDER BY age ASC).'
  },
  // 5
  {
    difficulty: 'EASY',
    category: 'SQL Sorting',
    question_text: 'Which keyword sorts the result set in descending order (highest to lowest)?',
    option_a: 'DESC',
    option_b: 'DOWN',
    option_c: 'REVERSE',
    option_d: 'HIGH',
    correct_option: 'A',
    explanation: 'DESC sorts records in descending order (e.g. ORDER BY salary DESC).'
  },
  // 6
  {
    difficulty: 'EASY',
    category: 'SQL Insertion',
    question_text: 'Which SQL statement is used to insert new records into a database table?',
    option_a: 'ADD INTO',
    option_b: 'INSERT INTO',
    option_c: 'UPDATE INTO',
    option_d: 'CREATE ROW',
    correct_option: 'B',
    explanation: 'INSERT INTO adds one or more new rows into a table.'
  },
  // 7
  {
    difficulty: 'EASY',
    category: 'SQL Updates',
    question_text: 'Which SQL statement is used to modify existing data in a table?',
    option_a: 'MODIFY',
    option_b: 'CHANGE',
    option_c: 'UPDATE',
    option_d: 'SET',
    correct_option: 'C',
    explanation: 'UPDATE statement modifies existing records matching the WHERE filter in a table.'
  },
  // 8
  {
    difficulty: 'EASY',
    category: 'SQL Deletion',
    question_text: 'Which SQL statement is used to delete records from a table?',
    option_a: 'REMOVE',
    option_b: 'CLEAR',
    option_c: 'DISCARD',
    option_d: 'DELETE FROM',
    correct_option: 'D',
    explanation: 'DELETE FROM removes rows from a table.'
  },
  // 9
  {
    difficulty: 'EASY',
    category: 'SQL Aggregation',
    question_text: 'Which aggregate function returns the total number of rows matching the query?',
    option_a: 'COUNT()',
    option_b: 'TOTAL()',
    option_c: 'NUMBER()',
    option_d: 'SUM()',
    correct_option: 'A',
    explanation: 'COUNT(*) calculates the total number of rows matching query criteria.'
  },
  // 10
  {
    difficulty: 'EASY',
    category: 'SQL Aggregation',
    question_text: 'Which aggregate function returns the total summed value of a numeric column?',
    option_a: 'ADD()',
    option_b: 'SUM()',
    option_c: 'TOTAL()',
    option_d: 'PLUS()',
    correct_option: 'B',
    explanation: 'SUM(column_name) returns the total numerical sum.'
  },
  // 11
  {
    difficulty: 'EASY',
    category: 'SQL Aggregation',
    question_text: 'Which function calculates the mathematical average of values in a numeric column?',
    option_a: 'MEAN()',
    option_b: 'MEDIAN()',
    option_c: 'AVG()',
    option_d: 'AVERAGE()',
    correct_option: 'C',
    explanation: 'AVG(column_name) returns the average value of a numeric column.'
  },
  // 12
  {
    difficulty: 'EASY',
    category: 'SQL Wildcards',
    question_text: 'In standard SQL, which operator is used along with wildcards (% and _) to search for a specified pattern in a column?',
    option_a: 'MATCH',
    option_b: 'SEARCH',
    option_c: 'CONTAINS',
    option_d: 'LIKE',
    correct_option: 'D',
    explanation: 'The LIKE operator searches for patterns in text columns using % and _.'
  },
  // 13
  {
    difficulty: 'EASY',
    category: 'SQL Wildcards',
    question_text: 'In a SQL LIKE pattern, which character represents exactly one single character?',
    option_a: 'Underscore (_)',
    option_b: 'Percent (%)',
    option_c: 'Question mark (?)',
    option_d: 'Asterisk (*)',
    correct_option: 'A',
    explanation: 'The underscore (_) represents exactly one single character in standard SQL LIKE clauses.'
  },
  // 14
  {
    difficulty: 'EASY',
    category: 'SQL Ranges',
    question_text: 'Which operator selects values within an inclusive range (e.g. BETWEEN 10 AND 50)?',
    option_a: 'RANGE',
    option_b: 'BETWEEN',
    option_c: 'WITHIN',
    option_d: 'INSIDE',
    correct_option: 'B',
    explanation: 'BETWEEN selects values within a given range, inclusive of both endpoints.'
  },
  // 15
  {
    difficulty: 'EASY',
    category: 'SQL NULL Handling',
    question_text: 'How do you check if a column contains a missing/null value in standard SQL?',
    option_a: 'WHERE column = NULL',
    option_b: 'WHERE column == NULL',
    option_c: 'WHERE column IS NULL',
    option_d: 'WHERE column IS EMPTY',
    correct_option: 'C',
    explanation: 'NULL values cannot be compared using =. You must use IS NULL or IS NOT NULL.'
  },
  // 16
  {
    difficulty: 'EASY',
    category: 'SQL Constraints',
    question_text: 'Which constraint uniquely identifies every record in a table and cannot contain NULL values?',
    option_a: 'CHECK',
    option_b: 'FOREIGN KEY',
    option_c: 'UNIQUE',
    option_d: 'PRIMARY KEY',
    correct_option: 'D',
    explanation: 'PRIMARY KEY uniquely identifies each row in a table and forbids NULLs.'
  },

  // ================= MEDIUM LEVEL (Joins, Grouping, Subqueries) =================
  // 17
  {
    difficulty: 'MEDIUM',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns only the rows that have matching values in both joined tables?',
    option_a: 'INNER JOIN',
    option_b: 'LEFT JOIN',
    option_c: 'RIGHT JOIN',
    option_d: 'FULL OUTER JOIN',
    correct_option: 'A',
    explanation: 'INNER JOIN selects records that have matching values in both tables.'
  },
  // 18
  {
    difficulty: 'MEDIUM',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns all records from the left table, and the matched records from the right table (with NULLs for non-matches)?',
    option_a: 'INNER JOIN',
    option_b: 'LEFT JOIN',
    option_c: 'CROSS JOIN',
    option_d: 'RIGHT JOIN',
    correct_option: 'B',
    explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched records from the right.'
  },
  // 19
  {
    difficulty: 'MEDIUM',
    category: 'SQL Grouping',
    question_text: 'Which clause is used to filter aggregated data resulting from a GROUP BY statement?',
    option_a: 'WHERE',
    option_b: 'ORDER BY',
    option_c: 'HAVING',
    option_d: 'FILTER',
    correct_option: 'C',
    explanation: 'HAVING is used to filter groups based on aggregate conditions (e.g. HAVING COUNT(*) > 5).'
  },
  // 20
  {
    difficulty: 'MEDIUM',
    category: 'SQL Set Operators',
    question_text: 'What is the main difference between UNION and UNION ALL?',
    option_a: 'UNION sorts alphabetically while UNION ALL sorts numerically',
    option_b: 'UNION ALL removes duplicates while UNION keeps them',
    option_c: 'UNION works only on text columns while UNION ALL works on numbers',
    option_d: 'UNION removes duplicate rows while UNION ALL includes all duplicate rows',
    correct_option: 'D',
    explanation: 'UNION deduplicates the combined results, whereas UNION ALL preserves duplicates and executes faster.'
  },
  // 21
  {
    difficulty: 'MEDIUM',
    category: 'SQL Grouping',
    question_text: 'In what sequence does a database execute these SQL clauses conceptually?',
    option_a: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
    option_b: 'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY',
    option_c: 'WHERE -> FROM -> SELECT -> GROUP BY -> HAVING -> ORDER BY',
    option_d: 'FROM -> SELECT -> WHERE -> ORDER BY -> GROUP BY -> HAVING',
    correct_option: 'A',
    explanation: 'Logical query processing starts with FROM, then WHERE, GROUP BY, HAVING, SELECT, and finally ORDER BY.'
  },
  // 22
  {
    difficulty: 'MEDIUM',
    category: 'SQL Subqueries',
    question_text: 'Which operator checks if a subquery returns at least one row, evaluating to TRUE or FALSE?',
    option_a: 'IN',
    option_b: 'EXISTS',
    option_c: 'ANY',
    option_d: 'CONTAINS',
    correct_option: 'B',
    explanation: 'EXISTS returns TRUE if the subquery returns one or more records.'
  },
  // 23
  {
    difficulty: 'MEDIUM',
    category: 'SQL Functions',
    question_text: 'Which standard SQL function returns the first non-null value from a list of expressions?',
    option_a: 'NVL()',
    option_b: 'IFNULL()',
    option_c: 'COALESCE()',
    option_d: 'ISNULL()',
    correct_option: 'C',
    explanation: 'COALESCE(val1, val2, ...) is standard ANSI SQL that returns the first non-null value in the argument list.'
  },
  // 24
  {
    difficulty: 'MEDIUM',
    category: 'SQL Window Functions',
    question_text: 'What SQL clause defines the partition and order over which a window function operates?',
    option_a: 'PARTITION',
    option_b: 'GROUP',
    option_c: 'WINDOW BY',
    option_d: 'OVER()',
    correct_option: 'D',
    explanation: 'The OVER() clause defines the window framing, partitioning, and ordering for window functions.'
  },

  // ================= HARD LEVEL (Advanced SQL, CTEs, Window Functions) =================
  // 25
  {
    difficulty: 'HARD',
    category: 'SQL Window Functions',
    question_text: 'What is the key difference between RANK() and DENSE_RANK() in standard SQL window functions?',
    option_a: 'DENSE_RANK() does not skip rank numbers when ties occur, whereas RANK() leaves gaps in the sequence',
    option_b: 'RANK() does not skip rank numbers when ties occur, whereas DENSE_RANK() leaves gaps',
    option_c: 'RANK() only works with integer columns whereas DENSE_RANK() works with text',
    option_d: 'DENSE_RANK() can only be used with SUM()',
    correct_option: 'A',
    explanation: 'When ties occur (e.g. two items tied for 1st place), RANK() assigns 1, 1, 3. DENSE_RANK() assigns 1, 1, 2 without gaps.'
  },
  // 26
  {
    difficulty: 'HARD',
    category: 'SQL Window Functions',
    question_text: 'Which window function accesses data from a preceding row at a specified physical offset within the partition?',
    option_a: 'LEAD()',
    option_b: 'LAG()',
    option_c: 'PREV()',
    option_d: 'FIRST_VALUE()',
    correct_option: 'B',
    explanation: 'LAG(column, offset) allows reading data from a prior row within the window without performing a self-join.'
  },
  // 27
  {
    difficulty: 'HARD',
    category: 'SQL CTEs',
    question_text: 'What SQL keyword introduces a Common Table Expression (CTE) to create a temporary named result set?',
    option_a: 'LET',
    option_b: 'DECLARE',
    option_c: 'WITH',
    option_d: 'DEFINE',
    correct_option: 'C',
    explanation: 'CTEs are created using the WITH keyword (e.g. WITH SalesCTE AS (SELECT ...)).'
  },
  // 28
  {
    difficulty: 'HARD',
    category: 'SQL Joins',
    question_text: 'What type of join produces a Cartesian product (every row of table 1 paired with every row of table 2)?',
    option_a: 'FULL OUTER JOIN',
    option_b: 'NATURAL JOIN',
    option_c: 'SELF JOIN',
    option_d: 'CROSS JOIN',
    correct_option: 'D',
    explanation: 'CROSS JOIN pairs every single row in the first table with every row in the second table.'
  },
  // 29
  {
    difficulty: 'HARD',
    category: 'SQL Subqueries',
    question_text: 'What defines a Correlated Subquery in SQL?',
    option_a: 'A subquery that references columns from the outer query and executes once for each row processed by the outer query',
    option_b: 'A subquery that executes only once before the outer query runs',
    option_c: 'A subquery that writes intermediate results into temporary physical tables',
    option_d: 'A subquery that cannot contain a WHERE clause',
    correct_option: 'A',
    explanation: 'A correlated subquery references values in the outer query, evaluating once for every candidate row of the outer statement.'
  },
  // 30
  {
    difficulty: 'HARD',
    category: 'SQL Window Functions',
    question_text: 'Which function divides rows in an ordered partition into a specified number of approximately equal groups (e.g. quartiles)?',
    option_a: 'BUCKET()',
    option_b: 'NTILE()',
    option_c: 'PARTITION_COUNT()',
    option_d: 'CHUNK()',
    correct_option: 'B',
    explanation: 'NTILE(n) distributes rows in an ordered partition into n roughly equal numbered buckets.'
  },
  // 31
  {
    difficulty: 'HARD',
    category: 'SQL Logic',
    question_text: 'Under three-valued logic (3VL) in standard SQL, what does comparing (NULL = NULL) evaluate to in a WHERE clause?',
    option_a: 'TRUE',
    option_b: 'FALSE',
    option_c: 'UNKNOWN (which is treated as false by WHERE filters)',
    option_d: 'NULL Pointer Exception',
    correct_option: 'C',
    explanation: 'In SQL, NULL represents missing information. NULL = NULL yields UNKNOWN, so the WHERE filter excludes it.'
  },
  // 32
  {
    difficulty: 'HARD',
    category: 'SQL Transactions',
    question_text: 'In database transaction management (ACID), which property ensures that all operations in a transaction either all succeed or all fail together?',
    option_a: 'Consistency',
    option_b: 'Isolation',
    option_c: 'Durability',
    option_d: 'Atomicity',
    correct_option: 'D',
    explanation: 'Atomicity ensures that a transaction is all-or-nothing: if any statement fails, the entire transaction rolls back.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  // Clear any existing questions to guarantee pure standard SQL curriculum
  await query('TRUNCATE TABLE questions CASCADE');

  for (const q of PURE_SQL_QUESTIONS) {
    const id = uuidv4();
    await query(
      `INSERT INTO questions (id, difficulty, category, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [id, q.difficulty, q.category, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation]
    );
  }
};

if (require.main === module) {
  seedQuestions()
    .then(() => {
      console.log('Successfully seeded 100% Pure Standard SQL Questions.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed questions:', err);
      process.exit(1);
    });
}
