import type { Resolvers } from './generated/graphql';
import { GraphQLScalarType, Kind } from 'graphql';
import { userResolvers } from './modules/user/user.resolver';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (value) => (value instanceof Date ? value.toISOString() : value),
  parseValue: (value) => (typeof value === 'string' ? new Date(value) : value),
  parseLiteral: (ast) =>
    ast.kind === Kind.STRING ? new Date(ast.value) : null,
});

export const resolvers: Resolvers = {
  DateTime: DateTime as any,
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
