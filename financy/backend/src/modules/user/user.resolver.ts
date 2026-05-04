import type { Resolvers } from '../../generated/graphql';
import { requireAuth } from '../../auth/requireAuth';
import { setAuthCookie, clearAuthCookie } from '../../auth/cookies';
import { signUp, signIn, findUserById } from './user.service';
import { throwError } from '../../errors';

export const userResolvers: Resolvers = {
  Query: {
    me: async (_, __, ctx) => {
      const userId = requireAuth(ctx);
      const user = await findUserById(ctx.prisma, userId);
      if (!user) throwError('NOT_FOUND', 'Usuário não encontrado');
      return {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        createdAt: user!.createdAt,
      };
    },
  },
  Mutation: {
    signUp: async (_, { input }, ctx) => {
      const { user, token } = await signUp(ctx.prisma, input);
      setAuthCookie(ctx.res, token, true);
      return { user };
    },
    signIn: async (_, { input }, ctx) => {
      const { user, token } = await signIn(ctx.prisma, input);
      setAuthCookie(ctx.res, token, input.rememberMe ?? false);
      return { user };
    },
    signOut: async (_, __, ctx) => {
      clearAuthCookie(ctx.res);
      return true;
    },
  },
};
