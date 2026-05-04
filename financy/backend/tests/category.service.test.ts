import { describe, it, expect, beforeEach } from 'vitest';
import { testPrisma, resetDb } from './helpers/db';
import { signUp } from '../src/modules/user/user.service';
import {
  listCategories, createCategory, updateCategory, deleteCategory,
} from '../src/modules/category/category.service';

process.env.JWT_SECRET = 'test-secret';

let userId = '';
let otherUserId = '';

beforeEach(async () => {
  await resetDb();
  userId = (await signUp(testPrisma, { name: 'A', email: 'a@a.com', password: 'pwpwpwpw' })).user.id;
  otherUserId = (await signUp(testPrisma, { name: 'B', email: 'b@b.com', password: 'pwpwpwpw' })).user.id;
});

describe('createCategory', () => {
  it('creates a category for the user', async () => {
    const c = await createCategory(testPrisma, userId, {
      title: 'Alimentação', description: 'Restaurantes', icon: 'utensils', color: 'green',
    });
    expect(c.title).toBe('Alimentação');
    expect(c.userId).toBe(userId);
  });
  it('rejects bad icon', async () => {
    await expect(
      createCategory(testPrisma, userId, { title: 'X', icon: 'invalid' as any, color: 'green' }),
    ).rejects.toThrow();
  });
});

describe('listCategories', () => {
  it('lists only own categories', async () => {
    await createCategory(testPrisma, userId, { title: 'Mine', icon: 'utensils', color: 'green' });
    await createCategory(testPrisma, otherUserId, { title: 'Theirs', icon: 'utensils', color: 'blue' });
    const list = await listCategories(testPrisma, userId);
    expect(list.map((c) => c.title)).toEqual(['Mine']);
  });
});

describe('updateCategory', () => {
  it('updates own category', async () => {
    const c = await createCategory(testPrisma, userId, { title: 'Old', icon: 'utensils', color: 'green' });
    const u = await updateCategory(testPrisma, userId, c.id, { title: 'New', icon: 'utensils', color: 'green' });
    expect(u.title).toBe('New');
  });
  it("forbids updating someone else's category", async () => {
    const c = await createCategory(testPrisma, otherUserId, { title: 'Theirs', icon: 'utensils', color: 'blue' });
    await expect(
      updateCategory(testPrisma, userId, c.id, { title: 'Hacked', icon: 'utensils', color: 'red' }),
    ).rejects.toThrow();
  });
});

describe('deleteCategory', () => {
  it('deletes own category', async () => {
    const c = await createCategory(testPrisma, userId, { title: 'X', icon: 'utensils', color: 'green' });
    await deleteCategory(testPrisma, userId, c.id);
    expect(await listCategories(testPrisma, userId)).toHaveLength(0);
  });
  it('blocks deletion when category has transactions', async () => {
    const c = await createCategory(testPrisma, userId, { title: 'X', icon: 'utensils', color: 'green' });
    await testPrisma.transaction.create({
      data: {
        description: 't', amount: '10', type: 'EXPENSE', date: new Date(),
        categoryId: c.id, userId,
      },
    });
    await expect(deleteCategory(testPrisma, userId, c.id)).rejects.toThrow(/transa[çc][ãa]/i);
  });
});
