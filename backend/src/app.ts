import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import testRoutes from './routes/test';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check for Render and monitoring
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/test', testRoutes);

  return app;
};
