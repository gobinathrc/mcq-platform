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
 * Curated comprehensive SQL Interview Questions
 * Perfectly balanced distribution of correct answers across A, B, C, and D.
 */
export const SQL_INTERVIEW_QUESTIONS: SeedQuestion[] = [
  // ================= EASY SQL QUESTIONS (12 Questions: 3 A, 3 B, 3 C, 3 D) =================
  {
    difficulty: 'EASY',
    category: 'SQL Filtering',
    question_text: 'Which SQL clause is used to filter records before any GROUP BY operations take place?',
    option_a: 'WHERE',
    option_b: 'HAVING',
    option_c: 'ORDER BY',
    option_d: 'LIMIT',
    correct_option: 'A',
    explanation: 'WHERE filters rows individually before any groupings are formed. HAVING filters aggregated data after GROUP BY.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Aggregation',
    question_text: 'Which aggregate function counts only rows where the specified column is NOT NULL?',
    option_a: 'COUNT(*)',
    option_b: 'COUNT(column_name)',
    option_c: 'TOTAL(column_name)',
    option_d: 'SUM(column_name)',
    correct_option: 'B',
    explanation: 'COUNT(column_name) ignores NULL values in that column, whereas COUNT(*) counts all rows regardless of NULLs.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Queries',
    question_text: 'Which SQL keyword is placed immediately after SELECT to eliminate duplicate rows from the result?',
    option_a: 'UNIQUE',
    option_b: 'DIFFERENT',
    option_c: 'DISTINCT',
    option_d: 'SINGLE',
    correct_option: 'C',
    explanation: 'SELECT DISTINCT returns only unique/different values across the selected columns.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns all rows from the right table, and matching records from the left table?',
    option_a: 'INNER JOIN',
    option_b: 'LEFT JOIN',
    option_c: 'CROSS JOIN',
    option_d: 'RIGHT JOIN',
    correct_option: 'D',
    explanation: 'RIGHT JOIN (or RIGHT OUTER JOIN) guarantees all records from the right table are returned, filling NULLs for non-matching left rows.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Sorting',
    question_text: 'Which keyword sorts the result set in descending order?',
    option_a: 'DESC',
    option_b: 'ASC',
    option_c: 'DOWN',
    option_d: 'REVERSE',
    correct_option: 'A',
    explanation: 'DESC stands for descending order (e.g. ORDER BY salary DESC). ASC is the default ascending order.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Conditions',
    question_text: 'Which operator is used to test whether a column value matches any value within a given list?',
    option_a: 'BETWEEN',
    option_b: 'IN',
    option_c: 'LIKE',
    option_d: 'EXISTS',
    correct_option: 'B',
    explanation: 'The IN operator allows you to specify multiple values in a WHERE clause (e.g. WHERE department_id IN (1, 2, 3)).'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Pattern Matching',
    question_text: 'In standard SQL LIKE patterns, which wildcard character represents any sequence of zero or more characters?',
    option_a: 'Question mark (?)',
    option_b: 'Underscore (_)',
    option_c: 'Percent sign (%)',
    option_d: 'Asterisk (*)',
    correct_option: 'C',
    explanation: 'In SQL LIKE clauses, % represents zero or more characters, while _ represents exactly one single character.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Constraints',
    question_text: 'Which SQL constraint uniquely identifies each record in a database table and disallows NULL values?',
    option_a: 'CHECK',
    option_b: 'FOREIGN KEY',
    option_c: 'UNIQUE',
    option_d: 'PRIMARY KEY',
    correct_option: 'D',
    explanation: 'A PRIMARY KEY uniquely identifies every record in a table and strictly forbids NULL values. UNIQUE allows NULL.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL DDL Commands',
    question_text: 'Which command removes all rows from a table quickly without logging individual row deletions?',
    option_a: 'TRUNCATE TABLE',
    option_b: 'DELETE FROM',
    option_c: 'DROP TABLE',
    option_d: 'REMOVE TABLE',
    correct_option: 'A',
    explanation: 'TRUNCATE TABLE is a DDL operation that deallocates data pages rapidly without generating individual row-level undo logs.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL NULL Handling',
    question_text: 'How do you check if a column called "bonus" contains a NULL value in SQL?',
    option_a: 'WHERE bonus = NULL',
    option_b: 'WHERE bonus IS NULL',
    option_c: 'WHERE bonus == NULL',
    option_d: 'WHERE bonus IS EMPTY',
    correct_option: 'B',
    explanation: 'NULL represents an unknown value, so standard equality (=) fails. You must test with IS NULL or IS NOT NULL.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Set Operators',
    question_text: 'What is the key difference between UNION and UNION ALL?',
    option_a: 'UNION ALL removes duplicates whereas UNION preserves all rows',
    option_b: 'UNION works only on integers whereas UNION ALL works on text',
    option_c: 'UNION removes duplicate rows whereas UNION ALL includes all duplicate rows',
    option_d: 'UNION sorts alphabetically whereas UNION ALL sorts numerically',
    correct_option: 'C',
    explanation: 'UNION performs an implicit distinct sort to eliminate duplicates; UNION ALL simply concatenates result sets faster without deduplication.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL Functions',
    question_text: 'Which scalar function returns the length of a string in PostgreSQL and standard SQL?',
    option_a: 'LEN()',
    option_b: 'SIZE()',
    option_c: 'COUNT()',
    option_d: 'LENGTH()',
    correct_option: 'D',
    explanation: 'In standard SQL and PostgreSQL, LENGTH(str) returns character count. LEN() is primarily Microsoft SQL Server.'
  },

  // ================= MEDIUM SQL QUESTIONS (12 Questions: 3 A, 3 B, 3 C, 3 D) =================
  {
    difficulty: 'MEDIUM',
    category: 'SQL Window Functions',
    question_text: 'Which window function assigns consecutive ranks without skipping any rank numbers when tied scores occur?',
    option_a: 'DENSE_RANK()',
    option_b: 'RANK()',
    option_c: 'ROW_NUMBER()',
    option_d: 'NTILE()',
    correct_option: 'A',
    explanation: 'DENSE_RANK() does not skip rank integers on ties (e.g. 1, 2, 2, 3), whereas RANK() produces gaps (1, 2, 2, 4).'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Window Functions',
    question_text: 'Which function allows accessing data from a preceding row in the same result set without using a self-join?',
    option_a: 'LEAD()',
    option_b: 'LAG()',
    option_c: 'FIRST_VALUE()',
    option_d: 'PREV()',
    correct_option: 'B',
    explanation: 'LAG(column, offset) provides access to a row at a given physical offset prior to the current position within the partition.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Indexing',
    question_text: 'Why does applying a function to an indexed column in the WHERE clause (e.g. WHERE UPPER(name) = "JOHN") often cause a full table scan?',
    option_a: 'Because SQL does not allow functions in WHERE clauses',
    option_b: 'Because string functions consume all database RAM',
    option_c: 'Because standard B-tree indexes store raw column values, preventing direct index key lookup unless an expression index exists',
    option_d: 'Because table locks prevent index reading during evaluation',
    correct_option: 'C',
    explanation: 'A normal B-Tree index indexes column values directly. Wrapping it in UPPER() forces the database to evaluate every row unless a functional/expression index is created.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Joins',
    question_text: 'What kind of join produces the Cartesian product of two tables (every row in table 1 paired with every row in table 2)?',
    option_a: 'NATURAL JOIN',
    option_b: 'FULL OUTER JOIN',
    option_c: 'INNER JOIN',
    option_d: 'CROSS JOIN',
    correct_option: 'D',
    explanation: 'CROSS JOIN pairs every row of the first table with every row of the second table, yielding (N x M) total rows.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Subqueries',
    question_text: 'What characterizes a Correlated Subquery in SQL?',
    option_a: 'A subquery that references columns from the outer query and evaluates once for every candidate row of the outer query',
    option_b: 'A subquery that executes only once before the main query begins',
    option_c: 'A subquery that writes results to a temporary table on disk',
    option_d: 'A subquery that can only be placed inside the FROM clause',
    correct_option: 'A',
    explanation: 'A correlated subquery depends on values from the outer query for its evaluation, re-executing for each row processed by the outer statement.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Aggregations',
    question_text: 'What will be the result of SELECT COUNT(1) FROM table_name compared to SELECT COUNT(*)?',
    option_a: 'COUNT(1) only counts rows where primary key is positive',
    option_b: 'They produce identical results in modern SQL query optimizers',
    option_c: 'COUNT(*) excludes NULL primary keys whereas COUNT(1) does not',
    option_d: 'COUNT(1) is always 10 times slower than COUNT(*)',
    correct_option: 'B',
    explanation: 'In modern relational database engines (PostgreSQL, MySQL, Oracle), COUNT(1) and COUNT(*) parse to identical query plans counting all rows.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL NULL Semantics',
    question_text: 'In three-valued logic (3VL), what is the evaluation of: SELECT 1 WHERE NULL = NULL; ?',
    option_a: 'Returns 1 because NULL is identical to NULL',
    option_b: 'Throws a syntax error',
    option_c: 'Returns nothing (empty set) because NULL = NULL evaluates to UNKNOWN, which falsifies the WHERE filter',
    option_d: 'Returns 0',
    correct_option: 'C',
    explanation: 'NULL represents missing/unknown information. Comparing NULL = NULL yields UNKNOWN (neither TRUE nor FALSE), so WHERE excludes it.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL CTEs',
    question_text: 'What SQL clause introduces a Common Table Expression (CTE)?',
    option_a: 'LET',
    option_b: 'DECLARE',
    option_c: 'HAVING',
    option_d: 'WITH',
    correct_option: 'D',
    explanation: 'A Common Table Expression is defined using the WITH keyword (e.g. WITH cte_name AS (SELECT ...)).'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL ACID Transactions',
    question_text: 'Which ACID property guarantees that once a transaction has committed, its changes survive system crashes or power failures?',
    option_a: 'Durability',
    option_b: 'Atomicity',
    option_c: 'Consistency',
    option_d: 'Isolation',
    correct_option: 'A',
    explanation: 'Durability ensures committed transaction changes are permanently written into non-volatile storage (WAL / disk) and survive crashes.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Data Integrity',
    question_text: 'What does ON DELETE CASCADE specify on a Foreign Key constraint?',
    option_a: 'Prevents the parent record from ever being deleted',
    option_b: 'Automatically deletes corresponding child rows when the referenced parent row is deleted',
    option_c: 'Sets foreign key values in child rows to 0',
    option_d: 'Logs a warning in database error logs without deleting anything',
    correct_option: 'B',
    explanation: 'ON DELETE CASCADE automatically cascades deletion to referencing child records when a parent record is deleted.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Performance',
    question_text: 'Which SQL command displays the execution plan and cost estimates generated by the database optimizer?',
    option_a: 'PROFILE',
    option_b: 'DESCRIBE',
    option_c: 'EXPLAIN',
    option_d: 'ANALYZE PLAN',
    correct_option: 'C',
    explanation: 'EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) displays the query execution plan, index scans, join algorithms, and execution timings.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'SQL Window Partitioning',
    question_text: 'In the window clause "OVER (PARTITION BY dept_id ORDER BY salary DESC)", what does PARTITION BY do?',
    option_a: 'Physical disk partitioning of the underlying table storage',
    option_b: 'Deletes duplicate dept_id records',
    option_c: 'Groups rows into summary rows like GROUP BY does',
    option_d: 'Divides the rows into logical subsets for calculation while retaining each individual row in the output',
    correct_option: 'D',
    explanation: 'PARTITION BY breaks calculation into subsets without reducing rows to single summary rows.'
  },

  // ================= HARD SQL QUESTIONS (12 Questions: 3 A, 3 B, 3 C, 3 D) =================
  {
    difficulty: 'HARD',
    category: 'SQL Isolation Levels',
    question_text: 'Which PostgreSQL transaction isolation level uses Serializable Snapshot Isolation (SSI) to completely prevent Write Skew and Phantom Reads?',
    option_a: 'SERIALIZABLE',
    option_b: 'REPEATABLE READ',
    option_c: 'READ COMMITTED',
    option_d: 'READ UNCOMMITTED',
    correct_option: 'A',
    explanation: 'SERIALIZABLE is the strictest isolation level and uses SSI (predicate locks) to prevent all concurrency anomalies including write skew.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Performance & Indexing',
    question_text: 'What is a "Covering Index" in relational database query optimization?',
    option_a: 'An index that encrypts table data on physical storage',
    option_b: 'An index that includes all columns referenced by a query, allowing index-only scans without fetching table heap pages',
    option_c: 'An index that automatically duplicates itself on all worker nodes',
    option_d: 'An index created exclusively on foreign keys',
    correct_option: 'B',
    explanation: 'A covering index satisfies all columns needed by SELECT and WHERE directly from the index tree, eliminating expensive table heap lookups (Index-Only Scan).'
  },
  {
    difficulty: 'HARD',
    category: 'PostgreSQL Architecture',
    question_text: 'Why does PostgreSQL require the VACUUM process to run on tables?',
    option_a: 'To repair corrupted B-tree indexes automatically',
    option_b: 'To defragment operating system disk partitions',
    option_c: 'To reclaim dead tuple space created by MVCC updates and deletes and prevent transaction ID wraparound',
    option_d: 'To convert tables from row format to columnar format',
    correct_option: 'C',
    explanation: 'PostgreSQL MVCC writes new row versions on UPDATE and marks rows as dead on DELETE. VACUUM reclaims this space and freezes old transaction IDs.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Window Framing',
    question_text: 'In SQL window functions, what is the default window frame when an ORDER BY clause is present without an explicit ROWS/RANGE clause?',
    option_a: 'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
    option_b: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
    option_c: 'RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING',
    option_d: 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
    correct_option: 'D',
    explanation: 'When ORDER BY is specified without a window frame, SQL defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Concurrency & Locks',
    question_text: 'Which locking clause locks rows against concurrent updates while allowing other transactions to read if they do not request exclusive locks?',
    option_a: 'SELECT ... FOR UPDATE',
    option_b: 'SELECT ... FOR SHARE',
    option_c: 'LOCK TABLE IN EXCLUSIVE MODE',
    option_d: 'SET TRANSACTION READ ONLY',
    correct_option: 'A',
    explanation: 'SELECT ... FOR UPDATE places an exclusive row-level lock on selected records, blocking other FOR UPDATE or UPDATE statements until the transaction concludes.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Recursive Queries',
    question_text: 'What two query blocks are combined with UNION ALL inside a standard Recursive Common Table Expression (CTE)?',
    option_a: 'A temporary table block and a trigger block',
    option_b: 'An Anchor Member (base case) and a Recursive Member (referencing the CTE itself)',
    option_c: 'An aggregated query and an unaggregated query',
    option_d: 'A materialized view and a foreign table',
    correct_option: 'B',
    explanation: 'Recursive CTEs consist of an Anchor member executing once to seed the recursion, and a Recursive member referencing the CTE until empty.'
  },
  {
    difficulty: 'HARD',
    category: 'PostgreSQL Index Types',
    question_text: 'Which PostgreSQL index type is specifically designed for indexing composite elements, full-text search vectors, and JSONB keys/values?',
    option_a: 'BRIN Index',
    option_b: 'Hash Index',
    option_c: 'GIN (Generalized Inverted Index)',
    option_d: 'B-Tree Index',
    correct_option: 'C',
    explanation: 'GIN (Generalized Inverted Index) maps component values (words, array elements, JSON keys) to row pointers, perfect for JSONB and full-text search.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Join Algorithms',
    question_text: 'Which physical join algorithm builds an in-memory hash table on the smaller relation and then scans the larger relation to find matches?',
    option_a: 'Nested Loop Join',
    option_b: 'Merge Join',
    option_c: 'Cartesian Loop Join',
    option_d: 'Hash Join',
    correct_option: 'D',
    explanation: 'A Hash Join hashes the join key of the smaller build table into memory and probes it by scanning the probe table in O(N + M) time.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Optimization & Indexing',
    question_text: 'When should a BRIN (Block Range Index) be preferred over a standard B-Tree index in PostgreSQL?',
    option_a: 'On very large append-only tables where column values correlate physically with their storage order (e.g. timestamp or serial IDs)',
    option_b: 'On small lookup tables with fewer than 100 records',
    option_c: 'On columns containing randomly distributed UUIDs',
    option_d: 'When queries frequently perform full-text pattern searches',
    correct_option: 'A',
    explanation: 'BRIN indexes store minimum and maximum values for blocks of pages. They take fractions of the space of B-Trees and excel at naturally sorted sequential data.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL Grouping Extensions',
    question_text: 'Which SQL GROUP BY extension produces all possible combinations of subtotals and a grand total for specified columns (2^n combinations)?',
    option_a: 'ROLLUP',
    option_b: 'CUBE',
    option_c: 'GROUPING SETS',
    option_d: 'PIVOT',
    correct_option: 'B',
    explanation: 'CUBE(A, B) generates groupings for (A,B), (A), (B), and (), representing all 2^N dimensional combinations. ROLLUP creates hierarchical subtotals.'
  },
  {
    difficulty: 'HARD',
    category: 'PostgreSQL Internals',
    question_text: 'What is the purpose of Write-Ahead Logging (WAL) in PostgreSQL database transactions?',
    option_a: 'To store human-readable debug audit logs for administrators',
    option_b: 'To cache active queries in shared memory',
    option_c: 'To guarantee durability and atomicity by ensuring all modifications are logged to durable disk before dirty data buffer pages are flushed',
    option_d: 'To translate SQL syntax into low-level C instructions',
    correct_option: 'C',
    explanation: 'WAL ensures transactional integrity and crash recovery: logs are written to disk sequentially before data files are modified, satisfying ACID Durability.'
  },
  {
    difficulty: 'HARD',
    category: 'SQL NULL Aggregations',
    question_text: 'Given a table "t" with 3 rows containing values: 10, NULL, and 20. What is the output of: SELECT AVG(val), SUM(val) / COUNT(*) FROM t; ?',
    option_a: 'Both return 15',
    option_b: 'Both return 10',
    option_c: 'AVG(val) throws an error; the second returns 10',
    option_d: 'AVG(val) returns 15 (ignores NULL, 30/2); SUM(val)/COUNT(*) returns 10 (30/3 including the NULL row)',
    correct_option: 'D',
    explanation: 'AVG(val) computes sum / non-null rows (30 / 2 = 15). COUNT(*) counts all rows including NULL (3), yielding 30 / 3 = 10.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  // Clear any existing generic questions to ensure 100% SQL focused curriculum
  await query('TRUNCATE TABLE questions CASCADE');

  for (const q of SQL_INTERVIEW_QUESTIONS) {
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
      console.log('Successfully seeded 100% SQL-focused interview questions with balanced A/B/C/D distribution.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed questions:', err);
      process.exit(1);
    });
}
