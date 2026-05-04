import { PrismaClient } from '@prisma/client';

export const testPrisma = new PrismaClient({
  datasources: { db: { url: 'file:./test.db' } },
});

export const resetDb = async () => {
  await testPrisma.transaction.deleteMany();
  await testPrisma.category.deleteMany();
  await testPrisma.user.deleteMany();
};
