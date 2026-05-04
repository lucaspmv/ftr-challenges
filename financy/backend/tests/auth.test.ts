import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../src/auth/password';
import { signToken, verifyToken } from '../src/auth/jwt';

describe('password', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('hunter2hunter');
    expect(hash).not.toBe('hunter2hunter');
    expect(await comparePassword('hunter2hunter', hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});

describe('jwt', () => {
  process.env.JWT_SECRET = 'test-secret';
  it('signs and verifies a token', () => {
    const token = signToken({ userId: 'u1' });
    expect(typeof token).toBe('string');
    expect(verifyToken(token)).toEqual({ userId: 'u1' });
  });
  it('throws on invalid token', () => {
    expect(() => verifyToken('garbage')).toThrow();
  });
});
