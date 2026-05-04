import type { Resolvers } from '../../generated/graphql';
import { requireAuth } from '../../auth/requireAuth';
import {
  createCategory, deleteCategory, getCategoryStats, listCategories, updateCategory,
} from './category.service';

export const categoryResolvers: Resolvers = {
  Query: {
    categories: async (_, __, ctx) => {
      const userId = requireAuth(ctx);
      return listCategories(ctx.prisma, userId) as any;
    },
  },
  Mutation: {
    createCategory: async (_, { input }, ctx) => {
      const userId = requireAuth(ctx);
      return createCategory(ctx.prisma, userId, input) as any;
    },
    updateCategory: async (_, { id, input }, ctx) => {
      const userId = requireAuth(ctx);
      return updateCategory(ctx.prisma, userId, id, input) as any;
    },
    deleteCategory: async (_, { id }, ctx) => {
      const userId = requireAuth(ctx);
      return deleteCategory(ctx.prisma, userId, id);
    },
  },
  Category: {
    transactionsCount: async (parent, _, ctx) =>
      (await getCategoryStats(ctx.prisma, parent.id)).transactionsCount,
    totalAmount: async (parent, _, ctx) =>
      (await getCategoryStats(ctx.prisma, parent.id)).totalAmount,
  },
};
