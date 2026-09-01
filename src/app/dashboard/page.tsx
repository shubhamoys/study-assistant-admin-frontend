"use client";

import { useQuery } from "@apollo/client/react";
import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useAuth } from "@/features/auth/use-auth";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import {
  ADMIN_DASHBOARD_STATS_QUERY,
  type AdminDashboardStatsQueryData,
} from "@/features/dashboard/graphql";
import styles from "./dashboard.module.scss";

const STAT_LABELS: { key: keyof AdminDashboardStatsQueryData["adminDashboardStats"]; label: string }[] = [
  { key: "totalUsers", label: "Users" },
  { key: "newUsersLast7Days", label: "New users (7d)" },
  { key: "totalDecks", label: "Decks" },
  { key: "totalPublicDecks", label: "Public decks" },
  { key: "totalFlashcards", label: "Flashcards" },
  { key: "totalReviews", label: "Reviews" },
];

export default function DashboardPage() {
  const { isReady } = useRequireAdmin();
  const { user } = useAuth();
  const { data, loading, error } = useQuery<AdminDashboardStatsQueryData>(
    ADMIN_DASHBOARD_STATS_QUERY,
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>
        Welcome back, {user?.displayName ?? user?.email}.
      </p>

      {loading && <p className={styles.status}>Loading stats…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load platform stats — is the backend running?
        </p>
      )}

      {data && (
        <div className={styles.statGrid}>
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className={`${styles.statCard} index-card`}>
              <span className={styles.statValue}>
                {data.adminDashboardStats[key]}
              </span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
