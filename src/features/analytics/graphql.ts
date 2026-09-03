import { gql } from "@apollo/client";

export const ADMIN_ANALYTICS_QUERY = gql`
  query AdminAnalytics {
    adminAnalytics {
      decksPerCategory {
        categoryName
        deckCount
      }
      topDecksByDownloads {
        id
        title
        downloadsCount
      }
      topDecksByRating {
        id
        title
        ratingAverage
        ratingCount
      }
      signupsByDay {
        date
        count
      }
      reviewsByDay {
        date
        count
      }
    }
  }
`;

export interface AdminAnalytics {
  decksPerCategory: { categoryName: string; deckCount: number }[];
  topDecksByDownloads: { id: string; title: string; downloadsCount: number }[];
  topDecksByRating: {
    id: string;
    title: string;
    ratingAverage: number;
    ratingCount: number;
  }[];
  signupsByDay: { date: string; count: number }[];
  reviewsByDay: { date: string; count: number }[];
}

export interface AdminAnalyticsQueryData {
  adminAnalytics: AdminAnalytics;
}
