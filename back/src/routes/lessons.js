import { Router } from 'express';
import { db } from '../db.js';
import { authRequired } from '../middleware.js';
import { newId, validExternalUrl } from '../utils.js';

export const lessonsRouter = Router();

function expand(lesson) {
  const topic = db.topics.find(x => x.id === lesson.topicId);
  const category = topic && db.categories.find(x => x.id === topic.categoryId);
  const discipline = category && db.disciplines.find(x => x.id === category.disciplineId);
  const professor = db.users.find(x => x.id === lesson.professorId);
  return { ...lesson, professor: professor && { id: professor.id, name: professor.name }, topic, category, discipline, materials: db.materials.filter(x => x.lessonId === lesson.id) };
}

lessonsRouter.get('/', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const results = db.lessons.filter(x => x.status === 'PUBLISHED').filter(x => !q || `${x.title} ${x.description}`.toLowerCase().includes(q));
  res.json({ items: results.map(expand), total: results.length });
});

lessonsRouter.get('/mine', authRequired, (req, res) => {
  const results = db.lessons.filter(lesson => lesson.professorId === req.user.id);
  res.json({ items: results.map(expand), total: results.length });
});

lessonsRouter.get('/mine/:id', authRequired, (req, res) => {
  const lesson = db.lessons.find(item => item.id === req.params.id && item.professorId === req.user.id);
  if (!lesson) return res.status(404).json({ error: 'NOT_FOUND', message: 'Videoaula não encontrada.' });
  res.json(expand(lesson));
});

lessonsRouter.get('/:id', (req, res) => {
  const lesson = db.lessons.find(x => x.id === req.params.id && x.status === 'PUBLISHED');
  if (!lesson) return res.status(404).json({ error: 'NOT_FOUND', message: 'Videoaula não encontrada.' });
  lesson.views += 1;
  res.json(expand(lesson));
});

lessonsRouter.post('/', authRequired, (req, res) => {
  const { title, description, videoUrl, topicId, status = 'DRAFT' } = req.body || {};
  if (!title || !description || !topicId || !validExternalUrl(videoUrl) || !db.topics.some(x => x.id === topicId) || !['DRAFT', 'PUBLISHED'].includes(status))
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Título, descrição, URL externa válida, tópico existente e status válido são obrigatórios.' });
  const now = new Date().toISOString();
  const lesson = { id: newId(), professorId: req.user.id, topicId, title: String(title).trim(), description: String(description).trim(), videoUrl, status, views: 0, createdAt: now, updatedAt: now };
  db.lessons.push(lesson);
  res.status(201).json(expand(lesson));
});

lessonsRouter.patch('/:id', authRequired, (req, res) => {
  const lesson = db.lessons.find(x => x.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'NOT_FOUND', message: 'Videoaula não encontrada.' });
  if (lesson.professorId !== req.user.id) return res.status(403).json({ error: 'FORBIDDEN', message: 'Você não é o autor desta videoaula.' });
  const allowed = ['title', 'description', 'videoUrl', 'topicId', 'status'];
  for (const key of allowed) if (req.body?.[key] !== undefined) lesson[key] = req.body[key];
  if (!validExternalUrl(lesson.videoUrl) || !db.topics.some(x => x.id === lesson.topicId) || !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(lesson.status))
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Dados inválidos.' });
  lesson.updatedAt = new Date().toISOString();
  res.json(expand(lesson));
});

lessonsRouter.delete('/:id', authRequired, (req, res) => {
  const index = db.lessons.findIndex(x => x.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Videoaula não encontrada.' });
  if (db.lessons[index].professorId !== req.user.id) return res.status(403).json({ error: 'FORBIDDEN', message: 'Você não é o autor desta videoaula.' });
  db.lessons.splice(index, 1);
  db.materials = db.materials.filter(x => x.lessonId !== req.params.id);
  res.status(204).end();
});

lessonsRouter.post('/:id/materials', authRequired, (req, res) => {
  const lesson = db.lessons.find(x => x.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'NOT_FOUND', message: 'Videoaula não encontrada.' });
  if (lesson.professorId !== req.user.id) return res.status(403).json({ error: 'FORBIDDEN', message: 'Você não é o autor desta videoaula.' });
  const { title, type, url } = req.body || {};
  if (!title || !type || !validExternalUrl(url)) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Título, tipo e URL válida são obrigatórios.' });
  const material = { id: newId(), lessonId: lesson.id, title: String(title).trim(), type: String(type).toUpperCase(), url };
  db.materials.push(material);
  res.status(201).json(material);
});
