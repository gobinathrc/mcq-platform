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

export const INTERVIEW_QUESTIONS: SeedQuestion[] = [
  // ================= EASY QUESTIONS (Interview Fundamentals) =================
  {
    difficulty: 'EASY',
    category: 'JavaScript',
    question_text: 'Which of the following is NOT a primitive data type in JavaScript?',
    option_a: 'String',
    option_b: 'Boolean',
    option_c: 'Object',
    option_d: 'Symbol',
    correct_option: 'C',
    explanation: 'In JavaScript, Object is a complex/reference type. String, Boolean, Number, BigInt, Symbol, null, and undefined are primitives.'
  },
  {
    difficulty: 'EASY',
    category: 'JavaScript',
    question_text: 'What is the outcome of typeof NaN in JavaScript?',
    option_a: '"undefined"',
    option_b: '"number"',
    option_c: '"NaN"',
    option_d: '"object"',
    correct_option: 'B',
    explanation: 'NaN stands for Not a Number, but its specification type in JavaScript is "number".'
  },
  {
    difficulty: 'EASY',
    category: 'Git',
    question_text: 'Which Git command creates a new branch and switches to it immediately?',
    option_a: 'git checkout branch_name',
    option_b: 'git checkout -b branch_name',
    option_c: 'git branch -new branch_name',
    option_d: 'git merge -b branch_name',
    correct_option: 'B',
    explanation: 'git checkout -b (or git switch -c) creates and switches to the new branch in one step.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL',
    question_text: 'Which SQL clause is used to filter rows before any groupings are applied?',
    option_a: 'HAVING',
    option_b: 'WHERE',
    option_c: 'GROUP BY',
    option_d: 'ORDER BY',
    correct_option: 'B',
    explanation: 'WHERE filters individual records before aggregation. HAVING filters after grouping.'
  },
  {
    difficulty: 'EASY',
    category: 'Web Basics',
    question_text: 'Which HTTP status code indicates a successfully created resource?',
    option_a: '200 OK',
    option_b: '201 Created',
    option_c: '204 No Content',
    option_d: '304 Not Modified',
    correct_option: 'B',
    explanation: '201 Created signifies that the request succeeded and resulted in a new resource being created.'
  },
  {
    difficulty: 'EASY',
    category: 'Data Structures',
    question_text: 'What is the average time complexity of accessing an element in an array by index?',
    option_a: 'O(1)',
    option_b: 'O(n)',
    option_c: 'O(log n)',
    option_d: 'O(n^2)',
    correct_option: 'A',
    explanation: 'Arrays offer direct memory index offsets, giving O(1) constant time lookup by index.'
  },
  {
    difficulty: 'EASY',
    category: 'Data Structures',
    question_text: 'Which data structure follows the First-In, First-Out (FIFO) principle?',
    option_a: 'Stack',
    option_b: 'Queue',
    option_c: 'Binary Tree',
    option_d: 'Graph',
    correct_option: 'B',
    explanation: 'A Queue works on FIFO (First-In First-Out).'
  },
  {
    difficulty: 'EASY',
    category: 'TypeScript',
    question_text: 'Which keyword is used to declare a variable that cannot be reassigned?',
    option_a: 'var',
    option_b: 'let',
    option_c: 'const',
    option_d: 'readonly',
    correct_option: 'C',
    explanation: 'const creates a block-scoped binding that cannot be reassigned.'
  },
  {
    difficulty: 'EASY',
    category: 'React',
    question_text: 'Which hook is used to perform side effects in a React functional component?',
    option_a: 'useState',
    option_b: 'useContext',
    option_c: 'useEffect',
    option_d: 'useReducer',
    correct_option: 'C',
    explanation: 'useEffect handles side effects such as data fetching, subscriptions, and DOM updates.'
  },
  {
    difficulty: 'EASY',
    category: 'SQL',
    question_text: 'Which keyword is used to return only distinct (different) values in SQL?',
    option_a: 'UNIQUE',
    option_b: 'DISTINCT',
    option_c: 'DIFFERENT',
    option_d: 'GROUP',
    correct_option: 'B',
    explanation: 'SELECT DISTINCT filters duplicate rows from the query result.'
  },
  {
    difficulty: 'EASY',
    category: 'Networking',
    question_text: 'Which port is the default standard for secure HTTPS traffic?',
    option_a: '80',
    option_b: '8080',
    option_c: '443',
    option_d: '22',
    correct_option: 'C',
    explanation: 'HTTPS default port is 443; HTTP default is 80.'
  },
  {
    difficulty: 'EASY',
    category: 'OOP',
    question_text: 'What OOP principle involves hiding the internal implementation details of an object?',
    option_a: 'Polymorphism',
    option_b: 'Encapsulation',
    option_c: 'Inheritance',
    option_d: 'Composition',
    correct_option: 'B',
    explanation: 'Encapsulation bundles data and methods while restricting direct access to internal components.'
  },
  {
    difficulty: 'EASY',
    category: 'JavaScript',
    question_text: 'Which method converts a JSON string into a JavaScript object?',
    option_a: 'JSON.stringify()',
    option_b: 'JSON.parse()',
    option_c: 'JSON.toObject()',
    option_d: 'JSON.decode()',
    correct_option: 'B',
    explanation: 'JSON.parse() parses a JSON formatted string and constructs the JS value or object.'
  },
  {
    difficulty: 'EASY',
    category: 'CSS',
    question_text: 'Which CSS display value enables a one-dimensional layout structure along a row or column?',
    option_a: 'grid',
    option_b: 'flex',
    option_c: 'block',
    option_d: 'inline-block',
    correct_option: 'B',
    explanation: 'Flexbox is primarily a one-dimensional layout model (row or column).'
  },

  // ================= MEDIUM QUESTIONS (Core Technical & Architecture) =================
  {
    difficulty: 'MEDIUM',
    category: 'JavaScript',
    question_text: 'What will "console.log(0.1 + 0.2 === 0.3)" output in JavaScript?',
    option_a: 'true',
    option_b: 'false',
    option_c: 'undefined',
    option_d: 'TypeError',
    correct_option: 'B',
    explanation: 'Due to IEEE 754 floating-point representation, 0.1 + 0.2 equals 0.30000000000000004, so the equality check is false.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Databases',
    question_text: 'What does the "I" stand for in the database ACID transaction properties?',
    option_a: 'Integrity',
    option_b: 'Indexation',
    option_c: 'Isolation',
    option_d: 'Immutability',
    correct_option: 'C',
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Node.js',
    question_text: 'In Node.js Event Loop, which queue takes highest priority and runs immediately after the current operation?',
    option_a: 'setImmediate queue (Check phase)',
    option_b: 'process.nextTick queue (Microtask queue)',
    option_c: 'setTimeout queue (Timers phase)',
    option_d: 'I/O polling queue (Poll phase)',
    correct_option: 'B',
    explanation: 'process.nextTick callbacks are processed immediately before any other event loop phase resumes.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Databases',
    question_text: 'What type of index is most commonly used in relational databases for B-Tree range queries?',
    option_a: 'Hash Index',
    option_b: 'B-Tree Index',
    option_c: 'Bitmap Index',
    option_d: 'Spatial Index',
    correct_option: 'B',
    explanation: 'B-Tree (Balanced Tree) indices maintain sorted order and excel at equality and range lookups.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'React',
    question_text: 'Why should keys in React lists be stable, unique, and not array indices when items can reorder?',
    option_a: 'Keys prevent memory leaks in the browser',
    option_b: 'Keys enable React to correctly identify which items have changed, added, or removed during reconciliation',
    option_c: 'Keys compile the virtual DOM to web assembly',
    option_d: 'Keys allow parent components to access child state directly',
    correct_option: 'B',
    explanation: 'Stable keys allow React diffing algorithm to match elements between renders, preventing DOM destruction and state bugs.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Security',
    question_text: 'Which header prevents a website from being loaded inside an <iframe>, mitigating clickjacking?',
    option_a: 'Access-Control-Allow-Origin',
    option_b: 'X-Frame-Options',
    option_c: 'Strict-Transport-Security',
    option_d: 'X-Content-Type-Options',
    correct_option: 'B',
    explanation: 'X-Frame-Options (or CSP frame-ancestors) instructs the browser whether the page can be rendered in an iframe.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Algorithms',
    question_text: 'What is the worst-case time complexity of the standard QuickSort algorithm?',
    option_a: 'O(n log n)',
    option_b: 'O(n)',
    option_c: 'O(n^2)',
    option_d: 'O(2^n)',
    correct_option: 'C',
    explanation: 'When the chosen pivot is consistently the smallest or largest element, QuickSort degrades to O(n^2).'
  },
  {
    difficulty: 'MEDIUM',
    category: 'TypeScript',
    question_text: 'In TypeScript, what is the key difference between "type" and "interface"?',
    option_a: 'Interfaces can be merged via declaration merging; type aliases cannot',
    option_b: 'Type aliases support inheritance while interfaces do not',
    option_c: 'Interfaces only exist at runtime whereas types are compile-time',
    option_d: 'Type aliases cannot define object structures',
    correct_option: 'A',
    explanation: 'Interfaces allow declaration merging (multiple declarations merge into one), whereas type aliases cannot be reopened.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Web Performance',
    question_text: 'What does HTTP/2 introduce to eliminate Head-of-Line blocking at the application layer?',
    option_a: 'UDP transport',
    option_b: 'Binary framing and stream multiplexing over a single TCP connection',
    option_c: 'WebSocket tunnels',
    option_d: 'HTTP pipelining without order constraints',
    correct_option: 'B',
    explanation: 'HTTP/2 multiplexes multiple request/response streams concurrently over a single TCP connection.'
  },
  {
    difficulty: 'MEDIUM',
    category: 'Architecture',
    question_text: 'What is the primary benefit of connection pooling in PostgreSQL under heavy concurrent traffic?',
    option_a: 'It compresses SQL queries before sending them',
    option_b: 'It reuses existing database connections to avoid expensive connection establishment overhead and OS thread limits',
    option_c: 'It caches all query results indefinitely',
    option_d: 'It transforms SQL into GraphQL',
    correct_option: 'B',
    explanation: 'PostgreSQL spawns a backend process per connection. Connection pooling prevents CPU thrashing and memory exhaustion.'
  },

  // ================= HARD QUESTIONS (Senior System Design & Advanced Concepts) =================
  {
    difficulty: 'HARD',
    category: 'Distributed Systems',
    question_text: 'According to the CAP theorem, what does a partition-tolerant system have to sacrifice during a network partition?',
    option_a: 'Scalability',
    option_b: 'Either Consistency or Availability',
    option_c: 'Data durability',
    option_d: 'Encryption',
    correct_option: 'B',
    explanation: 'When a network partition (P) occurs, the system must choose between serving potentially stale data (A) or returning an error/waiting (C).'
  },
  {
    difficulty: 'HARD',
    category: 'Concurrency',
    question_text: 'In PostgreSQL, which transaction isolation level prevents "Phantom Reads" using Multiversion Concurrency Control (MVCC) and predicate locks?',
    option_a: 'Read Committed',
    option_b: 'Repeatable Read',
    option_c: 'Serializable',
    option_d: 'Read Uncommitted',
    correct_option: 'C',
    explanation: 'Serializable isolation is the highest isolation level and uses SSI (Serializable Snapshot Isolation) to eliminate all anomalies including phantoms.'
  },
  {
    difficulty: 'HARD',
    category: 'Operating Systems',
    question_text: 'What condition causes "Thrashing" in a virtual memory operating system?',
    option_a: 'Deadlock between multiple mutexes',
    option_b: 'Excessive page swapping between RAM and disk due to working sets exceeding available physical memory',
    option_c: 'CPU cache misses on L1 cache',
    option_d: 'Buffer overflow in kernel stack',
    correct_option: 'B',
    explanation: 'Thrashing occurs when the OS spends more time paging data between memory and disk than executing user instructions.'
  },
  {
    difficulty: 'HARD',
    category: 'System Design',
    question_text: 'Which cache eviction strategy eliminates items that have not been accessed for the longest period of time?',
    option_a: 'LFU (Least Frequently Used)',
    option_b: 'FIFO (First In First Out)',
    option_c: 'LRU (Least Recently Used)',
    option_d: 'Random Eviction',
    correct_option: 'C',
    explanation: 'LRU discards the item that has gone unreferenced for the longest duration, often implemented using a Hash Map + Doubly Linked List.'
  },
  {
    difficulty: 'HARD',
    category: 'Database Internals',
    question_text: 'What is the purpose of Write-Ahead Logging (WAL) in PostgreSQL?',
    option_a: 'To maintain user activity logs for analytics',
    option_b: 'To guarantee durability and atomicity by ensuring changes are written to disk logs before data pages are flushed',
    option_c: 'To format JSON payloads into SQL tables',
    option_d: 'To automatically generate foreign key constraints',
    correct_option: 'B',
    explanation: 'WAL ensures that changes are recorded on durable storage before data files are modified, allowing crash recovery.'
  },
  {
    difficulty: 'HARD',
    category: 'Algorithms',
    question_text: 'What is the average and worst-case time complexity of searching a key in a Trie containing N keys with maximum string length L?',
    option_a: 'O(N * L)',
    option_b: 'O(L)',
    option_c: 'O(log N)',
    option_d: 'O(N^2)',
    correct_option: 'B',
    explanation: 'In a prefix Trie, searching is dependent strictly on the length of the string key (L), independent of the total number of keys (N).'
  },
  {
    difficulty: 'HARD',
    category: 'Security',
    question_text: 'In JWT (JSON Web Tokens), what vulnerability occurs if the server fails to verify the algorithm specified in the header?',
    option_a: 'SQL Injection',
    option_b: 'Alg "none" or HMAC/RSA key confusion attack allowing forged tokens',
    option_c: 'Cross-Site Scripting (XSS)',
    option_d: 'Timing attack on passwords',
    correct_option: 'B',
    explanation: 'If an attacker alters the header to `{"alg": "none"}` or tricks an asymmetric verification into using a public key with HMAC, signature checks are bypassed.'
  },
  {
    difficulty: 'HARD',
    category: 'System Design',
    question_text: 'What algorithm is commonly used for distributed rate limiting across multiple server nodes?',
    option_a: 'Sliding Window Counter using Redis Sorted Sets',
    option_b: 'Depth First Search',
    option_c: 'Merge Sort',
    option_d: 'Bloom Filter',
    correct_option: 'A',
    explanation: 'Sliding window log/counter utilizing Redis sorted sets or token bucket algorithms accurately manages distributed request quotas.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  for (const q of INTERVIEW_QUESTIONS) {
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
      console.log('Successfully seeded interview questions bank.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed questions:', err);
      process.exit(1);
    });
}
