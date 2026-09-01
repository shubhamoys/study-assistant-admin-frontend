import { gql } from "@apollo/client";
import type { AuthUser } from "./auth-slice";

// No REGISTER_MUTATION — the admin panel has no self-registration; admins
// are promoted from the main app's existing user base (see user-management,
// checkpoint 2) or seeded directly.
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        displayName
        role
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
      role
    }
  }
`;

interface AuthPayloadResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginMutationData {
  login: AuthPayloadResult;
}

export interface LoginMutationVars {
  input: { email: string; password: string };
}

export interface LogoutMutationData {
  logout: boolean;
}

export interface LogoutMutationVars {
  refreshToken: string;
}

export interface MeQueryData {
  me: AuthUser;
}
