import { Router } from 'express';
import { db } from '../db.js';

export const catalogRouter = Router();

catalogRouter.get('/', (req, res) => {
  res.json({ disciplines: db.disciplines, categories: db.categories, topics: db.topics });
});
