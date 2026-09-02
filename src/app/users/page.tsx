"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { UserList } from "@/features/users/user-list/user-list";
import styles from "./users.module.scss";

export default function UsersPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Users</h1>
      <p className={styles.subheading}>
        Search, filter, and manage admin access.
      </p>
      <UserList />
    </AdminShell>
  );
}
