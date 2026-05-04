import type { Resolvers } from '../../generated/graphql';
import { requireAuth } from '../../auth/requireAuth';
import { computeDashboard } from './dashboard.service';

export const dashboardResolvers: Resolvers = {
  Query: {
    dashboard: async (_, __, ctx) => {
      const userId = requireAuth(ctx);
      const stats = await computeDashboard(ctx.prisma, userId);
      return {
        ...stats,
        recentTransactions: stats.recentTransactions.map((t) => ({ ...t, amount: Number(t.amount) })),
      } as any;
    },
  },
};
