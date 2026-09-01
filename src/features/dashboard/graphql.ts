import { gql } from "@apollo/client";

export const ADMIN_DASHBOARD_STATS_QUERY = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalUsers
      totalDecks
      totalPublicDecks
      totalFlashcards
      totalReviews
      newUsersLast7Days
    }
  }
`;

export interface AdminDashboardStats {
  totalUsers: number;
  totalDecks: number;
  totalPublicDecks: number;
  totalFlashcards: number;
  totalReviews: number;
  newUsersLast7Days: number;
}

export interface AdminDashboardStatsQueryData {
  adminDashboardStats: AdminDashboardStats;
}
