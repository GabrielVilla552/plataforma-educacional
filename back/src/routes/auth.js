import { Router } from 'express';
import { db } from '../db.js';
import { config } from '../config.js';
import { authRequired } from '../middleware.js';
import { hashPassword, verifyPassword, newId, publicUser } from '../utils.js';
import { signJwt } from '../jwt.js';

export const authRouter = Router();

function emailOf(value) { return String(value || '').trim().toLowerCase(); }

authRouter.post('/register', (req, res) => {
  const { name, password, area = null, institution = null } = req.body || {};
  const email = emailOf(req.body?.email);
  if (!name || !email || typeof password !== 'string' || password.length < 8)
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Nome, e-mail e senha com pelo menos 8 caracteres são obrigatórios.' });
  if (db.users.some(user => user.email === email))
    return res.status(409).json({ error: 'EMAIL_IN_USE', message: 'E-mail já cadastrado.' });
  const user = { id: newId(), name: String(name).trim(), email, passwordHash: hashPassword(password), role: 'PROFESSOR', area, institution, createdAt: new Date().toISOString() };
  db.users.push(user);
  res.status(201).json(publicUser(user));
});

authRouter.post('/login', async (req, res) => {
  const email = emailOf(req.body?.email);
  const user = db.users.find(item => item.email === email);
  if (!user || !verifyPassword(String(req.body?.password || ''), user.passwordHash))
    return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos.' });
  const { token, expiresAt } = await signJwt(user.id, config.jwtSecret, config.tokenTtlSeconds);
  for (const [tokenId, expiry] of db.revokedTokens) {
    if (expiry <= Date.now() / 1000) db.revokedTokens.delete(tokenId);
  }
  res.json({ token, tokenType: 'Bearer', expiresAt: new Date(expiresAt).toISOString(), user: publicUser(user) });
});

authRouter.get('/me', authRequired, (req, res) => res.json(publicUser(req.user)));
authRouter.post('/logout', authRequired, (req, res) => {
  db.revokedTokens.set(req.tokenClaims.jti, req.tokenClaims.exp);
  res.status(204).end();
});
