/**
 * Database connection pool configuration
 * Tuned for 70+ concurrent test takers.
 */
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let activePool: Pool | null = null;

export const getDbConfig = (): PoolConfig => {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return {
      connectionString,
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('render.com') || connectionString.includes('neon.tech') 
        ? { rejectUnauthorized: false } 
        : undefined,
      max: Number(process.env.DB_POOL_MAX || 50),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'mcq_db',
    max: Number(process.env.DB_POOL_MAX || 50),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
};

/**
 * Returns singleton database pool.
 * Can be overridden in tests via setDbPool.
 */
export const getPool = (): Pool => {
  if (!activePool) {
    activePool = new Pool(getDbConfig());
  }
  return activePool;
};

export const setDbPool = (pool: Pool): void => {
  activePool = pool;
};

export const query = async (text: string, params?: any[]) => {
  const pool = getPool();
  return pool.query(text, params);
};
