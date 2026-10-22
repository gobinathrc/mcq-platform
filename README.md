# MCQ Assessment Platform (70+ Concurrent Examinees)

A high-performance Multiple Choice Question (MCQ) testing platform built for concurrency, immediate server-side scoring, candidate authentication, and PostgreSQL persistence.

---

## Features
- **Concurrent Load**: Tuned connection pooling (`pg.Pool`) configured for 70+ simultaneous candidates taking tests without lock contention.
- **Difficulty Selection**: Candidates choose between **Easy**, **Medium**, or **Hard** technical interview questions.
- **Exam Size & Shuffling**: Each test delivers **30 questions** with 4 options each, shuffled per examinee to prevent adjacent screen cheating.
- **Immediate Scoring**: Upon completion, scores are calculated instantly on the server and saved into PostgreSQL (`test_sessions` and `session_answers`).
- **Antigravity Glassmorphism UI**: Built with React, Tailwind CSS, Lucide icons, and confetti celebrations for passing grades.
- **Zero Question Leaks**: The frontend never receives the `correct_option` attribute during the active exam, preventing inspect-element cheating.

---

## Local Development & Testing

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Run automated test suite (TDD)
```bash
npm test
```

### 3. Local Run
Create a `.env` file from `.env.example`:
```bash
cp .env.example server/.env
```
Run backend & frontend:
```bash
# Terminal 1: Backend
npm run dev --prefix server

# Terminal 2: Frontend
npm run dev --prefix client
```

---

## Deployment to GitHub & Render

### Step 1: Push to GitHub
1. Create a repository on GitHub (e.g. `mcq-platform`).
2. Run in terminal:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/mcq-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read `render.yaml` and provision:
   - A **PostgreSQL database** (`mcq-postgres`).
   - A **Node.js Web Service** with `DATABASE_URL` auto-injected.
5. Automatic database migrations (`runMigrations`) and question bank seeding (`seedQuestions`) run on server start.
