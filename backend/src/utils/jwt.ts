import dotenv from 'dotenv';
dotenv.config();

/**
 * Single source of truth for JWT Secret
 */
export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'antigravity-secure-mcq-jwt-secret-2026-fallback-fixed';
};
