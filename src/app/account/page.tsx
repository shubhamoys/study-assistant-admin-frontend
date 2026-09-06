"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { AccountView } from "@/features/account/account-view/account-view";
import styles from "./account.module.scss";

export default function AccountPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Account settings</h1>
        <p className={styles.subheading}>
          Update your profile photo, display name, or password.
        </p>
        <AccountView />
      </div>
    </AdminShell>
  );
}
