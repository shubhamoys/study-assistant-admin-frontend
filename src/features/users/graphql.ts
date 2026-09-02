import { gql } from "@apollo/client";

export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export const ADMIN_USERS_QUERY = gql`
  query AdminUsers($search: String, $role: UserRole, $page: Int, $limit: Int) {
    adminUsers(search: $search, role: $role, page: $page, limit: $limit) {
      items {
        id
        email
        role
        isEmailVerified
        displayName
        createdAt
      }
      totalCount
      page
      totalPages
    }
  }
`;

export interface AdminUsersQueryData {
  adminUsers: {
    items: AdminUser[];
    totalCount: number;
    page: number;
    totalPages: number;
  };
}

export interface AdminUsersQueryVars {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export const ADMIN_UPDATE_USER_ROLE_MUTATION = gql`
  mutation AdminUpdateUserRole($id: ID!, $role: UserRole!) {
    adminUpdateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export interface AdminUpdateUserRoleMutationData {
  adminUpdateUserRole: { id: string; role: UserRole };
}

export interface AdminUpdateUserRoleMutationVars {
  id: string;
  role: UserRole;
}

export const ADMIN_CREATE_ADMIN_USER_MUTATION = gql`
  mutation AdminCreateAdminUser($input: CreateAdminUserInput!) {
    adminCreateAdminUser(input: $input) {
      id
      email
      role
    }
  }
`;

export interface AdminCreateAdminUserMutationData {
  adminCreateAdminUser: { id: string; email: string; role: UserRole };
}

export interface AdminCreateAdminUserMutationVars {
  input: { email: string; password: string; displayName: string };
}
