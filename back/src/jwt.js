import crypto from 'node:crypto';
import { errors, jwtVerify, SignJWT } from 'jose';

const algorithm = 'HS256';
const issuer = 'plataforma-educacional';
const audience = 'plataforma-educacional-api';
const encodeSecret = secret => new TextEncoder().encode(secret);

export async function signJwt(userId, secret, ttlSeconds, now = Math.floor(Date.now() / 1000)) {
  const expiresAt = now + ttlSeconds;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: algorithm, typ: 'JWT' })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .setJti(crypto.randomUUID())
    .sign(encodeSecret(secret));

  return { token, expiresAt: expiresAt * 1000 };
}

export async function verifyJwt(token, secret, now = Math.floor(Date.now() / 1000)) {
  try {
    const { payload, protectedHeader } = await jwtVerify(token, encodeSecret(secret), {
      algorithms: [algorithm],
      issuer,
      audience,
      currentDate: new Date(now * 1000)
    });

    if (
      protectedHeader.typ !== 'JWT' ||
      typeof payload.sub !== 'string' ||
      typeof payload.jti !== 'string' ||
      !Number.isInteger(payload.iat) ||
      !Number.isInteger(payload.exp) ||
      payload.iat > now
    ) return null;

    return payload;
  } catch (error) {
    if (error instanceof errors.JOSEError) return null;
    throw error;
  }
}
