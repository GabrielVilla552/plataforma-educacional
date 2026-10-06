import { db } from './db.js';
import { config } from './config.js';
import { verifyJwt } from './jwt.js';

export async function authRequired(req, res, next) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  const tokenClaims = match ? await verifyJwt(match[1], config.jwtSecret) : null;
  if (!tokenClaims || db.revokedTokens.has(tokenClaims.jti)) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token ausente ou inválido.' });
  }
  const user = db.users.find(item => item.id === tokenClaims.sub);
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Usuário não encontrado.' });
  req.user = user;
  req.tokenClaims = tokenClaims;
  next();
}

export function notFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Rota não encontrada.' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno inesperado.' });
}
