import test from 'node:test';
import assert from 'node:assert/strict';
import { signJwt, verifyJwt } from '../src/jwt.js';

const secret = 'test-secret-that-is-at-least-32-bytes';

test('assina e verifica um JWT com subject, id e expiração', async () => {
  const { token, expiresAt } = await signJwt('user-123', secret, 3600, 1_700_000_000);
  const claims = await verifyJwt(token, secret, 1_700_000_001);

  assert.equal(token.split('.').length, 3);
  assert.equal(claims.sub, 'user-123');
  assert.equal(claims.exp, 1_700_003_600);
  assert.equal(typeof claims.jti, 'string');
  assert.equal(expiresAt, 1_700_003_600_000);
});

test('rejeita token adulterado, expirado ou assinado com outro segredo', async () => {
  const { token } = await signJwt('user-123', secret, 60, 1_700_000_000);
  const [header, payload, signature] = token.split('.');
  const changedPayload = `${header}.${Buffer.from(JSON.stringify({ sub: 'attacker' })).toString('base64url')}.${signature}`;

  assert.equal(await verifyJwt(changedPayload, secret, 1_700_000_001), null);
  assert.equal(await verifyJwt(token, 'another-secret-that-is-at-least-32-bytes', 1_700_000_001), null);
  assert.equal(await verifyJwt(token, secret, 1_700_000_060), null);
  assert.equal(await verifyJwt('not-a-jwt', secret), null);
});
