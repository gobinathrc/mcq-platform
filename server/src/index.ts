import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { createApp } from './app';
import { runMigrations } from './db/migrate';
import { seedQuestions } from './db/seed';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApp();

// In production, serve client build if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

const startServer = async () => {
  try {
    console.log('Running automatic database migrations...');
    await runMigrations();
    console.log('Seeding initial question bank if empty...');
    await seedQuestions();

    app.listen(PORT, () => {
      console.log(`MCQ Platform Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
