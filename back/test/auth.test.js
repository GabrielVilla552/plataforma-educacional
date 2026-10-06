import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

test('login emite JWT aceito e logout revoga o token', async t => {
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise(resolve => server.once('listening', resolve));

  const address = server.address();
  const apiUrl = `http://127.0.0.1:${address.port}/api/v1`;
  const loginResponse = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'professor@demo.com', password: '12345678' })
  });
  assert.equal(loginResponse.status, 200);
  const { token } = await loginResponse.json();
  assert.equal(token.split('.').length, 3);

  const meResponse = await fetch(`${apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(meResponse.status, 200);

  const logoutResponse = await fetch(`${apiUrl}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(logoutResponse.status, 204);

  const revokedResponse = await fetch(`${apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(revokedResponse.status, 401);
});
