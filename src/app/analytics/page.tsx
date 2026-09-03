"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { AnalyticsView } from "@/features/analytics/analytics-view/analytics-view";
import styles from "./analytics.module.scss";

export default function AnalyticsPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Analytics</h1>
      <p className={styles.subheading}>
        Plain rankings and tables for now — graphs are a post-MVP follow-up.
      </p>
      <AnalyticsView />
    </AdminShell>
  );
}
