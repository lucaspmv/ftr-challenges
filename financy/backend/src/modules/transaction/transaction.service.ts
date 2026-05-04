import { Prisma, PrismaClient, TransactionType } from '@prisma/client';
import { transactionInputSchema, transactionsRangeSchema } from '../../validation/transaction';
import { throwError } from '../../errors';

type TransactionInput = {
  description: string;
  amount: number;
  type: TransactionType;
  date: Date | string;
  categoryId: string;
};

const validateInput = (raw: TransactionInput) => {
  const parsed = transactionInputSchema.safeParse(raw);
  if (!parsed.success) throwError('BAD_USER_INPUT', parsed.error.issues[0].message);
  return parsed.data!;
};

const monthRange = (month: number, year: number) => {
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return { gte: from, lt: to };
};

const ensureUserOwnsCategory = async (
  prisma: PrismaClient,
  userId: string,
  categoryId: string,
) => {
  const owned = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!owned) throwError('NOT_FOUND', 'Categoria não encontrada');
};

export const listTransactions = async (
  prisma: PrismaClient,
  userId: string,
  range: { month?: number | null; year?: number | null },
) => {
  const parsed = transactionsRangeSchema.safeParse(range);
  if (!parsed.success) throwError('BAD_USER_INPUT', parsed.error.issues[0].message);
  const { month, year } = parsed.data!;
  const where: Prisma.TransactionWhereInput = { userId };
  if (month && year) where.date = monthRange(month, year);
  return prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: 'desc' },
  });
};

export const createTransaction = async (
  prisma: PrismaClient,
  userId: string,
  rawInput: TransactionInput,
) => {
  const data = validateInput(rawInput);
  await ensureUserOwnsCategory(prisma, userId, data.categoryId);
  return prisma.transaction.create({
    data: { ...data, amount: new Prisma.Decimal(data.amount), userId },
    include: { category: true },
  });
};

export const updateTransaction = async (
  prisma: PrismaClient,
  userId: string,
  id: string,
  rawInput: TransactionInput,
) => {
  const data = validateInput(rawInput);
  await ensureUserOwnsCategory(prisma, userId, data.categoryId);
  const updated = await prisma.transaction.updateMany({
    where: { id, userId },
    data: { ...data, amount: new Prisma.Decimal(data.amount) },
  });
  if (updated.count === 0) throwError('NOT_FOUND', 'Transação não encontrada');
  return prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  }) as Promise<NonNullable<Awaited<ReturnType<typeof prisma.transaction.findUnique>>>>;
};

export const deleteTransaction = async (
  prisma: PrismaClient,
  userId: string,
  id: string,
) => {
  const result = await prisma.transaction.deleteMany({ where: { id, userId } });
  if (result.count === 0) throwError('NOT_FOUND', 'Transação não encontrada');
  return true;
};
