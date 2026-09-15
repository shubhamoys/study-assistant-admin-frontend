"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { AdminShell } from "@/components/admin-shell/admin-shell";
import { MAIN_APP_ORIGIN } from "@/lib/graphql-endpoint";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { DECK_QUERY, type DeckQueryData, type DeckQueryVars } from "../graphql";
import { DeckForm } from "../deck-form/deck-form";
import { FlashcardEditor } from "../flashcard-editor/flashcard-editor";
import styles from "./edit-deck-page.module.scss";

interface EditDeckPageProps {
  deckId: string;
}

export function EditDeckPage({ deckId }: EditDeckPageProps) {
  const { isReady } = useRequireAdmin();
  const { data, loading, error } = useQuery<DeckQueryData, DeckQueryVars>(
    DECK_QUERY,
    { variables: { id: deckId }, skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const deck = data?.deck;

  return (
    <AdminShell>
      <div className={styles.content}>
        <Link href="/decks" className={styles.backLink}>
          ← Back to decks
        </Link>

        {loading && <p className={styles.status}>Loading deck…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load this deck — it may have been removed.
          </p>
        )}

        {deck && (
          <>
            <div className={styles.headingRow}>
              <h1 className={styles.heading}>Edit deck</h1>
              <a
                href={`${MAIN_APP_ORIGIN}/store/${deck.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewLink}
              >
                View in store →
              </a>
            </div>
            <DeckForm
              mode="edit"
              deckId={deck.id}
              initial={{
                title: deck.title,
                description: deck.description,
                coverUrl: deck.coverUrl,
                categoryId: deck.category?.id ?? "",
                difficulty: deck.difficulty ?? "BEGINNER",
                isFree: deck.isFree,
                price: deck.price,
              }}
            />
            <div className={styles.flashcards}>
              <FlashcardEditor deckId={deck.id} />
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
