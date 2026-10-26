import { query } from './pool';
import { v4 as uuidv4 } from 'uuid';

export interface SeedQuestion {
  difficulty: 'ROOKIE' | 'PRO-BOWLER' | 'HALL OF FAMER';
  topic_id: string;
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const DEDICATED_SQL_BANK: SeedQuestion[] = [
  // ==================== ROOKIE LEVEL (Pure Beginner SQL: 12 Questions) ====================
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Basics',
    question_text: 'Which SQL statement is used to retrieve data from a database table?',
    option_a: 'SELECT',
    option_b: 'GET',
    option_c: 'EXTRACT',
    option_d: 'OPEN',
    correct_option: 'A',
    explanation: 'SELECT is used to query data from tables.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Filtering',
    question_text: 'Which SQL clause is used to filter rows based on a specific condition before grouping?',
    option_a: 'ORDER BY',
    option_b: 'WHERE',
    option_c: 'GROUP BY',
    option_d: 'LIMIT',
    correct_option: 'B',
    explanation: 'WHERE filters rows individually before aggregation.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Queries',
    question_text: 'Which keyword eliminates duplicate rows from the result set of a SELECT query?',
    option_a: 'UNIQUE',
    option_b: 'DIFFERENT',
    option_c: 'DISTINCT',
    option_d: 'SINGLE',
    correct_option: 'C',
    explanation: 'DISTINCT returns only unique rows.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Sorting',
    question_text: 'Which keyword is used to sort query results in ascending order (A-Z, 0-9)?',
    option_a: 'UP',
    option_b: 'ORDER',
    option_c: 'TOP',
    option_d: 'ASC',
    correct_option: 'D',
    explanation: 'ASC sorts records in ascending order.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Sorting',
    question_text: 'Which keyword is used to sort query results in descending order (highest to lowest)?',
    option_a: 'DESC',
    option_b: 'DOWN',
    option_c: 'HIGH',
    option_d: 'REVERSE',
    correct_option: 'A',
    explanation: 'DESC sorts records in descending order.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Insertion',
    question_text: 'Which SQL statement is used to add new rows of data into a database table?',
    option_a: 'ADD INTO',
    option_b: 'INSERT INTO',
    option_c: 'UPDATE INTO',
    option_d: 'CREATE ROW',
    correct_option: 'B',
    explanation: 'INSERT INTO adds new records into a table.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Updates',
    question_text: 'Which SQL statement modifies existing column values in a table?',
    option_a: 'CHANGE',
    option_b: 'MODIFY',
    option_c: 'UPDATE',
    option_d: 'SET',
    correct_option: 'C',
    explanation: 'UPDATE modifies existing records in a table.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Deletion',
    question_text: 'Which statement removes rows from a table while keeping the table structure intact?',
    option_a: 'REMOVE FROM',
    option_b: 'DISCARD FROM',
    option_c: 'DROP FROM',
    option_d: 'DELETE FROM',
    correct_option: 'D',
    explanation: 'DELETE FROM deletes rows matching the WHERE filter.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Aggregates',
    question_text: 'Which aggregate function counts only rows where the specified column is NOT NULL?',
    option_a: 'COUNT(column_name)',
    option_b: 'COUNT(*)',
    option_c: 'TOTAL(column_name)',
    option_d: 'SUM(column_name)',
    correct_option: 'A',
    explanation: 'COUNT(col) ignores NULL entries, whereas COUNT(*) counts all rows.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Pattern Matching',
    question_text: 'In standard SQL LIKE clauses, which wildcard character matches any sequence of zero or more characters?',
    option_a: 'Question mark (?)',
    option_b: 'Percent sign (%)',
    option_c: 'Underscore (_)',
    option_d: 'Asterisk (*)',
    correct_option: 'B',
    explanation: '% matches zero or more characters.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Ranges',
    question_text: 'Which SQL operator tests whether a value falls within an inclusive range (e.g., between 10 and 50)?',
    option_a: 'RANGE',
    option_b: 'WITHIN',
    option_c: 'BETWEEN',
    option_d: 'INSIDE',
    correct_option: 'C',
    explanation: 'BETWEEN tests whether a value is between lower and upper bounds inclusive.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL NULL Handling',
    question_text: 'How do you correctly check whether a column "phone" contains a missing/null value in SQL?',
    option_a: 'WHERE phone = NULL',
    option_b: 'WHERE phone == NULL',
    option_c: 'WHERE phone IS EMPTY',
    option_d: 'WHERE phone IS NULL',
    correct_option: 'D',
    explanation: 'NULL cannot be compared with =, so IS NULL must be used.'
  },

  // ==================== PRO-BOWLER LEVEL (Medium Practical SQL: 12 Questions) ====================
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns only the rows that have matching join keys in BOTH tables?',
    option_a: 'INNER JOIN',
    option_b: 'LEFT JOIN',
    option_c: 'RIGHT JOIN',
    option_d: 'FULL JOIN',
    correct_option: 'A',
    explanation: 'INNER JOIN outputs only matching records from both tables.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns all records from the left table and matched records from the right table, with NULLs for non-matches?',
    option_a: 'INNER JOIN',
    option_b: 'LEFT JOIN',
    option_c: 'CROSS JOIN',
    option_d: 'RIGHT JOIN',
    correct_option: 'B',
    explanation: 'LEFT JOIN returns all left rows plus matching right rows.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Grouping',
    question_text: 'Which clause is used to filter groups created by a GROUP BY clause based on aggregate values?',
    option_a: 'WHERE',
    option_b: 'ORDER BY',
    option_c: 'HAVING',
    option_d: 'QUALIFY',
    correct_option: 'C',
    explanation: 'HAVING filters aggregate calculations.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Set Operators',
    question_text: 'What is the key difference between UNION and UNION ALL?',
    option_a: 'UNION sorts alphabetically while UNION ALL sorts numerically',
    option_b: 'UNION ALL removes duplicate records while UNION retains them',
    option_c: 'UNION works only on integer columns while UNION ALL works on text',
    option_d: 'UNION removes duplicate rows while UNION ALL preserves all rows including duplicates',
    correct_option: 'D',
    explanation: 'UNION performs a distinct sort; UNION ALL retains duplicates.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Execution Order',
    question_text: 'In what order are SQL clauses logically evaluated by relational database engines?',
    option_a: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
    option_b: 'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY',
    option_c: 'WHERE -> FROM -> SELECT -> GROUP BY -> HAVING -> ORDER BY',
    option_d: 'FROM -> SELECT -> WHERE -> ORDER BY -> GROUP BY -> HAVING',
    correct_option: 'A',
    explanation: 'Logical query processing order begins with FROM and evaluates SELECT near the end.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Subqueries',
    question_text: 'Which operator checks whether a subquery returns any records at all, terminating as soon as a single match is found?',
    option_a: 'IN',
    option_b: 'EXISTS',
    option_c: 'ANY',
    option_d: 'CONTAINS',
    correct_option: 'B',
    explanation: 'EXISTS returns boolean TRUE as soon as a row is found.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Functions',
    question_text: 'Which ANSI SQL function evaluates a list of arguments and returns the first non-null value?',
    option_a: 'NVL()',
    option_b: 'IFNULL()',
    option_c: 'COALESCE()',
    option_d: 'ISNULL()',
    correct_option: 'C',
    explanation: 'COALESCE returns the first non-null expression.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Window Functions',
    question_text: 'Which window function assigns contiguous ranks without leaving gaps when duplicate values occur (e.g., 1, 1, 2)?',
    option_a: 'RANK()',
    option_b: 'ROW_NUMBER()',
    option_c: 'NTILE()',
    option_d: 'DENSE_RANK()',
    correct_option: 'D',
    explanation: 'DENSE_RANK() does not skip rank values upon ties.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Window Functions',
    question_text: 'Which window function provides access to a row value at a given physical offset prior to the current row without a self-join?',
    option_a: 'LAG()',
    option_b: 'LEAD()',
    option_c: 'FIRST_VALUE()',
    option_d: 'PREV()',
    correct_option: 'A',
    explanation: 'LAG(col, offset) accesses preceding row values.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL CTEs',
    question_text: 'Which clause defines a Common Table Expression (CTE) in standard SQL?',
    option_a: 'LET',
    option_b: 'WITH',
    option_c: 'DECLARE',
    option_d: 'TEMP TABLE',
    correct_option: 'B',
    explanation: 'WITH introduces a Common Table Expression.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Subqueries',
    question_text: 'What defines a Correlated Subquery in SQL?',
    option_a: 'A subquery that runs once before the outer query begins',
    option_b: 'A subquery that cannot contain aggregate functions',
    option_c: 'A subquery that references columns from the outer query, evaluating once for every candidate row of the outer query',
    option_d: 'A subquery that creates a physical table on disk',
    correct_option: 'C',
    explanation: 'Correlated subqueries depend on outer query column values.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Window Clause',
    question_text: 'In standard SQL window functions, which clause defines the partitioning, ordering, and framing of the calculation window?',
    option_a: 'PARTITION',
    option_b: 'GROUP',
    option_c: 'WINDOW BY',
    option_d: 'OVER()',
    correct_option: 'D',
    explanation: 'The OVER() clause configures window function partitions and orderings.'
  },

  // ==================== HALL OF FAMER LEVEL (Advanced SQL Architecture: 12 Questions) ====================
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Optimization',
    question_text: 'What is a "Covering Index" in relational database optimization?',
    option_a: 'An index that contains all columns requested by a query, allowing index-only scans without fetching table heap tuples',
    option_b: 'An index that encrypts data files on disk',
    option_c: 'An index created exclusively on foreign keys',
    option_d: 'An index that replicates automatically to standby replicas',
    correct_option: 'A',
    explanation: 'Covering indexes fulfill queries directly from the index tree without table heap reads.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Window Framing',
    question_text: 'In SQL window functions, what is the default window frame when an ORDER BY clause is specified without an explicit ROWS or RANGE clause?',
    option_a: 'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
    option_b: 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
    option_c: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
    option_d: 'RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING',
    correct_option: 'B',
    explanation: 'Default frame with ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Recursive Queries',
    question_text: 'What two query members are combined using UNION ALL inside a standard Recursive Common Table Expression (CTE)?',
    option_a: 'A temporary table block and a trigger',
    option_b: 'A materialized view and a cursor',
    option_c: 'An Anchor Member (base case) and a Recursive Member (referencing the CTE itself)',
    option_d: 'An aggregated query and an unaggregated query',
    correct_option: 'C',
    explanation: 'Recursive CTEs combine an anchor member and a recursive member.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Three-Valued Logic',
    question_text: 'In SQL three-valued logic (3VL), what does comparing (NULL = NULL) evaluate to in a WHERE clause?',
    option_a: 'TRUE',
    option_b: 'FALSE',
    option_c: 'UNKNOWN (which is treated as false by WHERE filters)',
    option_d: 'Error',
    correct_option: 'C',
    explanation: 'NULL represents unknown; NULL = NULL yields UNKNOWN, so the WHERE filter discards it.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Joins',
    question_text: 'Which join produces a Cartesian product where every row of table 1 is paired with every row of table 2?',
    option_a: 'CROSS JOIN',
    option_b: 'FULL OUTER JOIN',
    option_c: 'NATURAL JOIN',
    option_d: 'SELF JOIN',
    correct_option: 'A',
    explanation: 'CROSS JOIN produces the Cartesian product of two tables.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Index Optimization',
    question_text: 'Why does applying a function to an indexed column (e.g. WHERE UPPER(email) = "JOHN@ACME.COM") prevent normal B-Tree index lookups?',
    option_a: 'String functions consume too much memory',
    option_b: 'Standard B-trees store raw column values, so computing a function requires evaluating every row unless an expression/functional index exists',
    option_c: 'SQL standard disallows functions in WHERE clauses',
    option_d: 'Table locks block index reads during function evaluation',
    correct_option: 'B',
    explanation: 'Evaluating functions on columns invalidates direct index range lookups unless an expression index is created.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Transactions',
    question_text: 'Which ACID property guarantees that all SQL operations within a transaction either completely commit or fully rollback on error?',
    option_a: 'Consistency',
    option_b: 'Isolation',
    option_c: 'Atomicity',
    option_d: 'Durability',
    correct_option: 'C',
    explanation: 'Atomicity enforces all-or-nothing execution.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Locking',
    question_text: 'Which clause locks the selected rows against concurrent UPDATE statements until the active transaction completes?',
    option_a: 'LOCK TABLE',
    option_b: 'SELECT ... FOR UPDATE',
    option_c: 'SET TRANSACTION ISOLATION LEVEL',
    option_d: 'READ ONLY',
    correct_option: 'B',
    explanation: 'SELECT ... FOR UPDATE takes an exclusive row-level lock on selected rows.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Grouping Extensions',
    question_text: 'Which SQL GROUP BY extension produces all 2^N possible dimensional subtotals and grand totals for specified columns?',
    option_a: 'CUBE',
    option_b: 'ROLLUP',
    option_c: 'GROUPING SETS',
    option_d: 'PIVOT',
    correct_option: 'A',
    explanation: 'CUBE generates all combinations of subtotals and grand total.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Joins Algorithms',
    question_text: 'Which physical join algorithm builds an in-memory hash table on the smaller relation and scans the larger relation to find matches?',
    option_a: 'Merge Join',
    option_b: 'Nested Loop Join',
    option_c: 'Hash Join',
    option_d: 'Cartesian Loop',
    correct_option: 'C',
    explanation: 'Hash Join hashes the smaller relation into memory and probes it with the larger relation.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Window Functions',
    question_text: 'Which function splits an ordered partition into N approximately equal numbered buckets?',
    option_a: 'BUCKET()',
    option_b: 'NTILE()',
    option_c: 'PERCENT_RANK()',
    option_d: 'CHUNK()',
    correct_option: 'B',
    explanation: 'NTILE(n) distributes rows in an ordered partition into n buckets.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Execution Plans',
    question_text: 'Which SQL command displays the optimizer\'s execution plan, operator costs, and index usage without modifying table data?',
    option_a: 'DESCRIBE',
    option_b: 'PROFILE',
    option_c: 'EXPLAIN',
    option_d: 'SHOW PLAN',
    correct_option: 'C',
    explanation: 'EXPLAIN outputs the query execution plan generated by the optimizer.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  await query('TRUNCATE TABLE questions CASCADE');

  for (const q of DEDICATED_SQL_BANK) {
    const id = uuidv4();
    await query(
      `INSERT INTO questions (id, difficulty, topic_id, category, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [id, q.difficulty, q.topic_id, q.category, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation]
    );
  }
};

if (require.main === module) {
  seedQuestions()
    .then(() => {
      console.log('Successfully seeded 100% dedicated SQL questions.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed questions:', err);
      process.exit(1);
    });
}
