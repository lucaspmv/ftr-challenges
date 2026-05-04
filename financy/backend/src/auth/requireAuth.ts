import { GraphQLError } from 'graphql';
import type { GraphQLContext } from '../context';

export const requireAuth = (ctx: GraphQLContext): string => {
  if (!ctx.userId) {
    throw new GraphQLError('Unauthenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return ctx.userId;
};
