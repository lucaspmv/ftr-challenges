import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.graphql',
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        contextType: '../context#GraphQLContext',
        useIndexSignature: true,
        scalars: { DateTime: 'Date' },
        avoidOptionals: { object: true, defaultValue: true },
        inputMaybeValue: 'T | undefined',
      },
    },
  },
};

export default config;
