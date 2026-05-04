import { gql } from '@/generated';

export const CATEGORIES = gql(/* GraphQL */ `
  query Categories {
    categories { id title description icon color transactionsCount totalAmount createdAt }
  }
`);

export const CREATE_CATEGORY = gql(/* GraphQL */ `
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) { id title description icon color transactionsCount totalAmount createdAt }
  }
`);

export const UPDATE_CATEGORY = gql(/* GraphQL */ `
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) { id title description icon color }
  }
`);

export const DELETE_CATEGORY = gql(/* GraphQL */ `
  mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }
`);
