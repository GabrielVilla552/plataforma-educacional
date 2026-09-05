import express from 'express';
import { authRouter } from './routes/auth.js';
import { catalogRouter } from './routes/catalog.js';
import { lessonsRouter } from './routes/lessons.js';
import { notFound, errorHandler } from './middleware.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
app.get('/health', (req, res) => res.json({ status: 'ok', version: 'v1' }));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/lessons', lessonsRouter);
app.use(notFound);
app.use(errorHandler);
