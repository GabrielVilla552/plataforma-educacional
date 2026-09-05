import { db } from './db.js';

export function authRequired(req, res, next) {
  const value = req.headers.authorization || '';
  const token = value.startsWith('Bearer ') ? value.slice(7) : null;
  const session = token ? db.sessions.get(token) : null;
  if (!session || session.expiresAt <= Date.now()) {
    if (token) db.sessions.delete(token);
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token ausente ou inválido.' });
  }
  const user = db.users.find(item => item.id === session.userId);
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Usuário não encontrado.' });
  req.user = user;
  req.token = token;
  next();
}

export function notFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Rota não encontrada.' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno inesperado.' });
}
