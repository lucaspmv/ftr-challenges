import { describe, it, expect, beforeEach } from 'vitest';
import { testPrisma, resetDb } from './helpers/db';
import { signUp, signIn } from '../src/modules/user/user.service';

beforeEach(resetDb);
process.env.JWT_SECRET = 'test-secret';

describe('signUp', () => {
  it('creates a user and returns it with a token', async () => {
    const result = await signUp(testPrisma, {
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'hunter2hunter',
    });
    expect(result.user.email).toBe('lucas@example.com');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(typeof result.token).toBe('string');
  });

  it('rejects duplicate email', async () => {
    await signUp(testPrisma, { name: 'A', email: 'a@a.com', password: 'pwpwpwpw' });
    await expect(
      signUp(testPrisma, { name: 'B', email: 'a@a.com', password: 'pwpwpwpw' }),
    ).rejects.toThrow(/cadastrado/i);
  });

  it('rejects weak password', async () => {
    await expect(
      signUp(testPrisma, { name: 'X', email: 'x@x.com', password: 'short' }),
    ).rejects.toThrow();
  });
});

describe('signIn', () => {
  beforeEach(async () => {
    await signUp(testPrisma, {
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'hunter2hunter',
    });
  });
  it('signs in valid credentials', async () => {
    const r = await signIn(testPrisma, {
      email: 'lucas@example.com',
      password: 'hunter2hunter',
    });
    expect(r.user.email).toBe('lucas@example.com');
    expect(typeof r.token).toBe('string');
  });
  it('rejects bad password', async () => {
    await expect(
      signIn(testPrisma, { email: 'lucas@example.com', password: 'wrongpass1' }),
    ).rejects.toThrow(/inv[aá]lid/i);
  });
  it('rejects unknown email', async () => {
    await expect(
      signIn(testPrisma, { email: 'no@no.com', password: 'whatever1' }),
    ).rejects.toThrow(/inv[aá]lid/i);
  });
});
