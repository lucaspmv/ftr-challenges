import { PrismaClient } from '@prisma/client';
import { categoryInputSchema } from '../../validation/category';
import { throwError } from '../../errors';

type CategoryInput = {
  title: string;
  description?: string | null;
  icon: string;
  color: string;
};

const validate = (input: CategoryInput) => {
  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) throwError('BAD_USER_INPUT', parsed.error.issues[0].message);
  return parsed.data!;
};

export const listCategories = async (prisma: PrismaClient, userId: string) => {
  return prisma.category.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
};

export const createCategory = async (
  prisma: PrismaClient,
  userId: string,
  rawInput: CategoryInput,
) => {
  const data = validate(rawInput);
  return prisma.category.create({ data: { ...data, userId } });
};

export const updateCategory = async (
  prisma: PrismaClient,
  userId: string,
  id: string,
  rawInput: CategoryInput,
) => {
  const data = validate(rawInput);
  const result = await prisma.category.updateMany({
    where: { id, userId },
    data,
  });
  if (result.count === 0) throwError('NOT_FOUND', 'Categoria não encontrada');
  return prisma.category.findUnique({ where: { id } }) as Promise<NonNullable<Awaited<ReturnType<typeof prisma.category.findUnique>>>>;
};

export const deleteCategory = async (
  prisma: PrismaClient,
  userId: string,
  id: string,
) => {
  const cat = await prisma.category.findFirst({ where: { id, userId } });
  if (!cat) throwError('NOT_FOUND', 'Categoria não encontrada');
  const txCount = await prisma.transaction.count({ where: { categoryId: id } });
  if (txCount > 0) {
    throwError(
      'CONFLICT',
      `Categoria possui ${txCount} transação(ões). Remova-as antes de excluir.`,
    );
  }
  await prisma.category.delete({ where: { id } });
  return true;
};

export const getCategoryStats = async (prisma: PrismaClient, categoryId: string) => {
  const [count, sum] = await Promise.all([
    prisma.transaction.count({ where: { categoryId } }),
    prisma.transaction.aggregate({
      where: { categoryId },
      _sum: { amount: true },
    }),
  ]);
  return {
    transactionsCount: count,
    totalAmount: Number(sum._sum.amount ?? 0),
  };
};
