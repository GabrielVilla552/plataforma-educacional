import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, validExternalUrl } from '../src/utils.js';

test('hash e verificação de senha', () => {
  const hash = hashPassword('senha-segura');
  assert.equal(verifyPassword('senha-segura', hash), true);
  assert.equal(verifyPassword('senha-errada', hash), false);
});

test('validação de URL', () => {
  assert.equal(validExternalUrl('https://youtube.com/watch?v=1'), true);
  assert.equal(validExternalUrl('javascript:alert(1)'), false);
});
