import { PrismaClient } from '@prisma/client';

export const computeDashboard = async (prisma: PrismaClient, userId: string) => {
  const now = new Date();
  const monthFrom = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [allAgg, monthAgg, recent, categories] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: monthFrom, lt: monthTo } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { userId },
      include: { _count: { select: { transactions: true } } },
    }),
  ]);

  const allMap = new Map(allAgg.map((a) => [a.type, Number(a._sum.amount ?? 0)]));
  const monthMap = new Map(monthAgg.map((a) => [a.type, Number(a._sum.amount ?? 0)]));

  const totalIncome = allMap.get('INCOME') ?? 0;
  const totalExpense = allMap.get('EXPENSE') ?? 0;
  const totalBalance = totalIncome - totalExpense;
  const monthIncome = monthMap.get('INCOME') ?? 0;
  const monthExpense = monthMap.get('EXPENSE') ?? 0;

  const categoryTotals = await Promise.all(
    categories.map(async (c) => {
      const sum = await prisma.transaction.aggregate({
        where: { categoryId: c.id },
        _sum: { amount: true },
      });
      return {
        category: c,
        count: c._count.transactions,
        totalAmount: Number(sum._sum.amount ?? 0),
      };
    }),
  );
  const categoriesSummary = categoryTotals
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalBalance,
    monthIncome,
    monthExpense,
    recentTransactions: recent,
    categoriesSummary,
  };
};
