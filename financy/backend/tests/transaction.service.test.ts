import { describe, it, expect, beforeEach } from 'vitest';
import { testPrisma, resetDb } from './helpers/db';
import { signUp } from '../src/modules/user/user.service';
import { createCategory } from '../src/modules/category/category.service';
import {
  createTransaction, listTransactions, updateTransaction, deleteTransaction,
} from '../src/modules/transaction/transaction.service';
import { computeDashboard } from '../src/modules/dashboard/dashboard.service';

process.env.JWT_SECRET = 'test-secret';

let userId = '';
let otherUserId = '';
let categoryId = '';

beforeEach(async () => {
  await resetDb();
  userId = (await signUp(testPrisma, { name: 'A', email: 'a@a.com', password: 'pwpwpwpw' })).user.id;
  otherUserId = (await signUp(testPrisma, { name: 'B', email: 'b@b.com', password: 'pwpwpwpw' })).user.id;
  categoryId = (await createCategory(testPrisma, userId, { title: 'Food', icon: 'utensils', color: 'green' })).id;
});

describe('createTransaction', () => {
  it('creates a transaction owned by the user', async () => {
    const t = await createTransaction(testPrisma, userId, {
      description: 'Lunch', amount: 25.5, type: 'EXPENSE',
      date: new Date('2026-05-01'), categoryId,
    });
    expect(t.userId).toBe(userId);
  });
  it('rejects negative amount', async () => {
    await expect(
      createTransaction(testPrisma, userId, {
        description: 'Bad', amount: -1, type: 'EXPENSE',
        date: new Date(), categoryId,
      }),
    ).rejects.toThrow();
  });
});

describe('listTransactions', () => {
  it('lists only own transactions', async () => {
    const otherCat = await createCategory(testPrisma, otherUserId, { title: 'X', icon: 'utensils', color: 'blue' });
    await createTransaction(testPrisma, userId,        { description: 'mine',   amount: 1, type: 'EXPENSE', date: new Date('2026-05-10'), categoryId });
    await createTransaction(testPrisma, otherUserId,   { description: 'theirs', amount: 1, type: 'EXPENSE', date: new Date('2026-05-10'), categoryId: otherCat.id });
    const list = await listTransactions(testPrisma, userId, { month: null, year: null });
    expect(list.map((t) => t.description)).toEqual(['mine']);
  });

  it('filters by month/year when both given', async () => {
    await createTransaction(testPrisma, userId, { description: 'apr', amount: 1, type: 'EXPENSE', date: new Date('2026-04-15'), categoryId });
    await createTransaction(testPrisma, userId, { description: 'may', amount: 1, type: 'EXPENSE', date: new Date('2026-05-15'), categoryId });
    const may = await listTransactions(testPrisma, userId, { month: 5, year: 2026 });
    expect(may.map((t) => t.description)).toEqual(['may']);
  });
});

describe('updateTransaction', () => {
  it('updates own transaction', async () => {
    const t = await createTransaction(testPrisma, userId, { description: 'old', amount: 1, type: 'EXPENSE', date: new Date(), categoryId });
    const u = await updateTransaction(testPrisma, userId, t.id, {
      description: 'new', amount: 2, type: 'EXPENSE', date: new Date(), categoryId,
    });
    expect(u.description).toBe('new');
  });
  it("forbids updating someone else's transaction", async () => {
    const otherCat = await createCategory(testPrisma, otherUserId, { title: 'X', icon: 'utensils', color: 'blue' });
    const t = await createTransaction(testPrisma, otherUserId, {
      description: 'theirs', amount: 1, type: 'EXPENSE', date: new Date(), categoryId: otherCat.id,
    });
    await expect(
      updateTransaction(testPrisma, userId, t.id, {
        description: 'hacked', amount: 1, type: 'EXPENSE', date: new Date(), categoryId,
      }),
    ).rejects.toThrow();
  });
});

describe('deleteTransaction', () => {
  it('deletes own transaction', async () => {
    const t = await createTransaction(testPrisma, userId, { description: 'x', amount: 1, type: 'EXPENSE', date: new Date(), categoryId });
    await deleteTransaction(testPrisma, userId, t.id);
    expect(await listTransactions(testPrisma, userId, { month: null, year: null })).toHaveLength(0);
  });
});

describe('computeDashboard', () => {
  it('computes balance, income and expense for the current month', async () => {
    const now = new Date();
    await createTransaction(testPrisma, userId, { description: 'salary', amount: 4000, type: 'INCOME',  date: now, categoryId });
    await createTransaction(testPrisma, userId, { description: 'lunch',  amount:   30, type: 'EXPENSE', date: now, categoryId });
    const stats = await computeDashboard(testPrisma, userId);
    expect(stats.monthIncome).toBe(4000);
    expect(stats.monthExpense).toBe(30);
    expect(stats.totalBalance).toBe(3970);
    expect(stats.recentTransactions.length).toBeGreaterThan(0);
  });
});
