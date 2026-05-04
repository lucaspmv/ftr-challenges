import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        scalars: { DateTime: 'string' },
        useTypeImports: true,
      },
    },
  },
};

export default config;
