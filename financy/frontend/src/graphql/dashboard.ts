import { gql } from '@/generated';

export const DASHBOARD = gql(/* GraphQL */ `
  query Dashboard {
    dashboard {
      totalBalance monthIncome monthExpense
      recentTransactions {
        id description amount type date
        category { id title icon color }
      }
      categoriesSummary {
        category { id title icon color }
        count totalAmount
      }
    }
  }
`);
