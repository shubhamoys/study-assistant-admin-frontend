"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { DeckForm } from "@/features/decks/deck-form/deck-form";
import styles from "./new-deck.module.scss";

export default function NewDeckPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <Link href="/decks" className={styles.backLink}>
        ← Back to decks
      </Link>
      <h1 className={styles.heading}>Create deck</h1>
      <DeckForm mode="create" />
    </AdminShell>
  );
}
