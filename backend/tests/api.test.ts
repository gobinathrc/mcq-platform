import request from 'supertest';
import { newDb } from 'pg-mem';
import { createApp } from '../src/app';
import { setDbPool } from '../src/db/pool';
import { runMigrations } from '../src/db/migrate';
import { seedQuestions } from '../src/db/seed';

describe('MCQ Platform End-to-End API Suite', () => {
  let app: any;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Spin up an in-memory PostgreSQL instance with pg-mem
    const db = newDb();

    // Register random() in pg-mem
    db.public.registerFunction({
      name: 'random',
      args: [],
      implementation: () => Math.random()
    });

    const pgAdapter = db.adapters.createPg();
    const mockPool = new pgAdapter.Pool();

    setDbPool(mockPool as any);
    app = createApp();

    // Run schema migrations and seed questions
    await runMigrations();
    await seedQuestions();
  });

  describe('1. Authentication Flow', () => {
    it('should register a new candidate successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('jane@example.com');
      authToken = res.body.token;
      testUserId = res.body.user.id;
    });

    it('should prevent duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Jane',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/i);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });

    it('should allow guest examinee login with instant credentials', async () => {
      const res = await request(app)
        .post('/api/auth/guest')
        .send();

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toMatch(/^Guest Candidate/);
      expect(res.body.user.email).toMatch(/@mcqtest\.local$/);
    });
  });

  describe('2. Test Session & Scoring Flow', () => {
    let currentSessionId: string;
    let questionsReceived: any[];

    it('should disallow unauthenticated users from starting tests', async () => {
      const res = await request(app)
        .post('/api/test/start')
        .send({ difficulty: 'EASY' });

      expect(res.status).toBe(401);
    });

    it('should start an Easy test session, shuffle questions, and NOT reveal correct options', async () => {
      const res = await request(app)
        .post('/api/test/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ difficulty: 'EASY', count: 10 });

      expect(res.status).toBe(201);
      expect(res.body.sessionId).toBeDefined();
      expect(res.body.questions.length).toBeGreaterThan(0);

      currentSessionId = res.body.sessionId;
      questionsReceived = res.body.questions;

      // Verify each question has 4 options and no correct_option leak
      for (const q of questionsReceived) {
        expect(q.options.length).toBe(4);
        expect(q.correct_option).toBeUndefined();
      }
    });

    it('should evaluate answers, calculate score immediately and persist answers', async () => {
      // Pick answers: choose option A for all questions to test evaluation
      const answersToSubmit = questionsReceived.map((q) => ({
        questionId: q.id,
        selectedOption: 'A' as const
      }));

      const res = await request(app)
        .post('/api/test/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId: currentSessionId,
          answers: answersToSubmit
        });

      expect(res.status).toBe(200);
      expect(res.body.score).toBeDefined();
      expect(typeof res.body.percentage).toBe('number');
      expect(res.body.totalQuestions).toBe(questionsReceived.length);
      expect(typeof res.body.passed).toBe('boolean');
      // Verify anti-leak: breakdown with answer keys should NOT be exposed in exam submission response
      expect(res.body.breakdown).toBeUndefined();
    });

    it('should prevent resubmitting the same completed session', async () => {
      const res = await request(app)
        .post('/api/test/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId: currentSessionId,
          answers: []
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/already been completed/i);
    });

    it('should return completed test history for the candidate', async () => {
      const res = await request(app)
        .get('/api/test/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sessions.length).toBeGreaterThan(0);
      expect(res.body.sessions[0].status).toBe('COMPLETED');
    });
  });
});
