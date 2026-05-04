import { GraphQLError } from 'graphql';

export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'BAD_USER_INPUT'
  | 'NOT_FOUND'
  | 'CONFLICT';

export const throwError = (code: ErrorCode, message: string): never => {
  throw new GraphQLError(message, { extensions: { code } });
};
