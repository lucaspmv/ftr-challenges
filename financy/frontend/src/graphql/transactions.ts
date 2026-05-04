import { gql } from '@/generated';

export const TRANSACTIONS = gql(/* GraphQL */ `
  query Transactions($month: Int, $year: Int) {
    transactions(month: $month, year: $year) {
      id description amount type date
      category { id title icon color }
    }
  }
`);

export const CREATE_TRANSACTION = gql(/* GraphQL */ `
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id description amount type date
      category { id title icon color }
    }
  }
`);

export const UPDATE_TRANSACTION = gql(/* GraphQL */ `
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id description amount type date
      category { id title icon color }
    }
  }
`);

export const DELETE_TRANSACTION = gql(/* GraphQL */ `
  mutation DeleteTransaction($id: ID!) { deleteTransaction(id: $id) }
`);
