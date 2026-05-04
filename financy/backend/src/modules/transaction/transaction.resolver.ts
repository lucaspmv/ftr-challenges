import type { Resolvers } from '../../generated/graphql';
import { requireAuth } from '../../auth/requireAuth';
import {
  createTransaction, deleteTransaction, listTransactions, updateTransaction,
} from './transaction.service';

const toGraphTx = (t: any) => ({
  ...t,
  amount: Number(t.amount),
});

export const transactionResolvers: Resolvers = {
  Query: {
    transactions: async (_, args, ctx) => {
      const userId = requireAuth(ctx);
      const list = await listTransactions(ctx.prisma, userId, args);
      return list.map(toGraphTx);
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, ctx) => {
      const userId = requireAuth(ctx);
      const t = await createTransaction(ctx.prisma, userId, input);
      return toGraphTx(t);
    },
    updateTransaction: async (_, { id, input }, ctx) => {
      const userId = requireAuth(ctx);
      const t = await updateTransaction(ctx.prisma, userId, id, input);
      return toGraphTx(t);
    },
    deleteTransaction: async (_, { id }, ctx) => {
      const userId = requireAuth(ctx);
      return deleteTransaction(ctx.prisma, userId, id);
    },
  },
};
