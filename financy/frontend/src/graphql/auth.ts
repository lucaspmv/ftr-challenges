import { gql } from '@/generated';

export const SIGN_UP = gql(/* GraphQL */ `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      user { id name email createdAt }
    }
  }
`);

export const SIGN_IN = gql(/* GraphQL */ `
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      user { id name email createdAt }
    }
  }
`);

export const SIGN_OUT = gql(/* GraphQL */ `
  mutation SignOut { signOut }
`);

export const ME = gql(/* GraphQL */ `
  query Me {
    me { id name email createdAt }
  }
`);

export const UPDATE_USER = gql(/* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) { id name email createdAt }
  }
`);
