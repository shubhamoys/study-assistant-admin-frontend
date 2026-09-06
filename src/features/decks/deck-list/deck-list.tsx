"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { MAIN_APP_ORIGIN } from "@/lib/graphql-endpoint";
import { formatPrice } from "@/lib/format-price";
import {
  ADMIN_DECKS_QUERY,
  ADMIN_DELETE_DECK_MUTATION,
  CATEGORIES_QUERY,
  type AdminDecksQueryData,
  type AdminDecksQueryVars,
  type AdminDeleteDeckMutationData,
  type AdminDeleteDeckMutationVars,
  type CategoriesQueryData,
} from "../graphql";
import styles from "./deck-list.module.scss";

export function DeckList() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY);
  const { data, loading, error, refetch } = useQuery<
    AdminDecksQueryData,
    AdminDecksQueryVars
  >(ADMIN_DECKS_QUERY, {
    variables: {
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
    },
  });

  const [deleteDeck, { loading: deleting }] = useMutation<
    AdminDeleteDeckMutationData,
    AdminDeleteDeckMutationVars
  >(ADMIN_DELETE_DECK_MUTATION);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      await deleteDeck({ variables: { id } });
      await refetch();
    } catch {
      // The list simply won't update — no dedicated error banner for a
      // low-stakes retry action.
    }
  }

  return (
    <div>
      <div className={styles.controls}>
        <Input
          type="search"
          placeholder="Search decks…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.search}
          aria-label="Search decks"
        />
        <Select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className={styles.categoryFilter}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categoriesData?.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Button asChild>
          <Link href="/decks/new">Create deck</Link>
        </Button>
      </div>

      {loading && <p className={styles.status}>Loading decks…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load decks. Please check your connection and try again.
        </p>
      )}
      {data && data.adminDecks.length === 0 && (
        <div className={`${styles.empty} index-card-dashed`}>
          <p>No decks match. Create one to get started.</p>
        </div>
      )}

      <div className={styles.grid}>
        {data?.adminDecks.map((deck) => (
          <article key={deck.id} className={`${styles.card} index-card`}>
            <div className={styles.cardBody}>
              <div className={styles.cardTags}>
                <span className="tag">
                  {deck.category?.name ?? "Uncategorized"}
                </span>
                <span className="tag">
                  {deck.isFree ? "Free" : formatPrice(deck.price)}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{deck.title}</h2>
              <p className={styles.cardMeta}>
                {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"} ·{" "}
                {deck.downloadsCount} downloads
                {deck.ratingCount > 0 &&
                  ` · ${deck.ratingAverage.toFixed(1)}★ (${deck.ratingCount})`}
              </p>
            </div>
            <div className={styles.cardActions}>
              <Button asChild variant="secondary" size="sm">
                <a
                  href={`${MAIN_APP_ORIGIN}/store/${deck.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/decks/${deck.id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => void handleDelete(deck.id, deck.title)}
                disabled={deleting}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
