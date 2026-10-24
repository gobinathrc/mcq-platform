import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { query } from '../db/pool';
import { getJwtSecret } from '../utils/jwt';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Register a new examinee
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors[0].message });
      return;
    }

    const { name, email, password } = parse.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await query(
      'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)',
      [userId, name.trim(), normalizedEmail, passwordHash]
    );

    const token = jwt.sign({ userId, email: normalizedEmail, name: name.trim() }, getJwtSecret(), {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name: name.trim(), email: normalizedEmail }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * Login examinee
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors[0].message });
      return;
    }

    const { email, password } = parse.data;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, getJwtSecret(), {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;
