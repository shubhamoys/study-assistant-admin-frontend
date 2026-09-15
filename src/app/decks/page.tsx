"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { DeckList } from "@/features/decks/deck-list/deck-list";
import styles from "./decks.module.scss";

export default function DecksPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Decks</h1>
      <p className={styles.subheading}>
        Every deck here is public — visible in the Store to every user the
        moment it&apos;s created.
      </p>
      <DeckList />
    </AdminShell>
  );
}
