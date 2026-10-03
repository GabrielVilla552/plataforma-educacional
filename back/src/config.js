import { randomBytes } from 'node:crypto';

const jwtSecret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production'
    ? ''
    : randomBytes(32).toString('base64url')
);

if (!jwtSecret) {
  throw new Error('JWT_SECRET é obrigatório em produção e deve ter pelo menos 32 bytes.');
}

if (Buffer.byteLength(jwtSecret) < 32) {
  throw new Error('JWT_SECRET deve ter pelo menos 32 bytes.');
}

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET não definido: usando uma chave temporária, tokens serão invalidados ao reiniciar o servidor.');
}

export const config = {
  port: Number(3000),
  tokenTtlSeconds: Number(28800),
  jwtSecret
};
