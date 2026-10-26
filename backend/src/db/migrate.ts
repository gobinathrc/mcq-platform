import { query } from './pool';

/**
 * Migration script creating schemas for users, questions, test_sessions, and session_answers.
 */
export const runMigrations = async (): Promise<void> => {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id VARCHAR(64) PRIMARY KEY,
      difficulty VARCHAR(20) NOT NULL, -- 'ROOKIE', 'PRO-BOWLER', 'HALL OF FAMER' (or EASY, MEDIUM, HARD)
      topic_id VARCHAR(20) NOT NULL DEFAULT 'all',
      category VARCHAR(100) NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
      explanation TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_questions_diff ON questions(difficulty);
    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);

    CREATE TABLE IF NOT EXISTS test_sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      difficulty VARCHAR(20) NOT NULL,
      total_questions INT NOT NULL,
      score INT DEFAULT 0,
      percentage NUMERIC(5,2) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED'
      started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON test_sessions(user_id);

    CREATE TABLE IF NOT EXISTS session_answers (
      id VARCHAR(64) PRIMARY KEY,
      session_id VARCHAR(64) REFERENCES test_sessions(id) ON DELETE CASCADE,
      question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
      selected_option CHAR(1), -- 'A', 'B', 'C', 'D' or null if skipped
      is_correct BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_session_answers ON session_answers(session_id);
  `;

  await query(schemaSql);
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database migrations executed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database migration error:', err);
      process.exit(1);
    });
}
