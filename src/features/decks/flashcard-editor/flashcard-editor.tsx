"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content/markdown-content";
import { MarkdownEditor } from "@/components/markdown-editor/markdown-editor";
import {
  ADMIN_CREATE_FLASHCARD_MUTATION,
  ADMIN_DECK_FLASHCARDS_QUERY,
  ADMIN_DELETE_FLASHCARD_MUTATION,
  ADMIN_UPDATE_FLASHCARD_MUTATION,
  type AdminCreateFlashcardMutationData,
  type AdminCreateFlashcardMutationVars,
  type AdminDeckFlashcardsQueryData,
  type AdminDeckFlashcardsQueryVars,
  type AdminDeleteFlashcardMutationData,
  type AdminDeleteFlashcardMutationVars,
  type AdminUpdateFlashcardMutationData,
  type AdminUpdateFlashcardMutationVars,
  type Flashcard,
} from "../graphql";
import { flashcardSchema, type FlashcardFormValues } from "../schemas";
import styles from "./flashcard-editor.module.scss";

interface FlashcardEditorProps {
  deckId: string;
}

export function FlashcardEditor({ deckId }: FlashcardEditorProps) {
  const { data, loading, refetch } = useQuery<
    AdminDeckFlashcardsQueryData,
    AdminDeckFlashcardsQueryVars
  >(ADMIN_DECK_FLASHCARDS_QUERY, { variables: { deckId } });
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const flashcards = data?.adminDeckFlashcards ?? [];

  const [updateFlashcard] = useMutation<
    AdminUpdateFlashcardMutationData,
    AdminUpdateFlashcardMutationVars
  >(ADMIN_UPDATE_FLASHCARD_MUTATION);
  const [deleteFlashcard, { loading: deleting }] = useMutation<
    AdminDeleteFlashcardMutationData,
    AdminDeleteFlashcardMutationVars
  >(ADMIN_DELETE_FLASHCARD_MUTATION);

  function closeForm() {
    setEditingId(null);
    void refetch();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this flashcard?")) return;
    try {
      await deleteFlashcard({ variables: { id } });
      await refetch();
    } catch {
      // Row simply stays put — no dedicated error banner for this retry action.
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const other = flashcards[index + direction];
    const current = flashcards[index];
    if (!other) return;
    try {
      await Promise.all([
        updateFlashcard({
          variables: { id: current.id, input: { orderIndex: other.orderIndex } },
        }),
        updateFlashcard({
          variables: { id: other.id, input: { orderIndex: current.orderIndex } },
        }),
      ]);
      await refetch();
    } catch {
      // Order simply stays put on failure.
    }
  }

  return (
    <section className={`${styles.section} index-card`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Flashcards ({flashcards.length})</h2>
        {editingId === null && (
          <Button type="button" size="sm" onClick={() => setEditingId("new")}>
            Add flashcard
          </Button>
        )}
      </div>

      {loading && <p className={styles.status}>Loading flashcards…</p>}

      {editingId === "new" && (
        <FlashcardForm deckId={deckId} onSaved={closeForm} onCancel={() => setEditingId(null)} />
      )}

      <ul className={styles.list}>
        {flashcards.map((card, index) =>
          editingId === card.id ? (
            <li key={card.id}>
              <FlashcardForm
                deckId={deckId}
                flashcard={card}
                onSaved={closeForm}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={card.id} className={styles.row}>
              <div className={styles.rowContent}>
                <MarkdownContent className={styles.rowPreview}>
                  {card.front}
                </MarkdownContent>
              </div>
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.moveButton}
                  onClick={() => void handleMove(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.moveButton}
                  onClick={() => void handleMove(index, 1)}
                  disabled={index === flashcards.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingId(card.id)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDelete(card.id)}
                  disabled={deleting}
                >
                  Delete
                </Button>
              </div>
            </li>
          ),
        )}
      </ul>

      {!loading && flashcards.length === 0 && editingId !== "new" && (
        <p className={styles.status}>No flashcards yet — add your first one above.</p>
      )}
    </section>
  );
}

interface FlashcardFormProps {
  deckId: string;
  flashcard?: Flashcard;
  onSaved: () => void;
  onCancel: () => void;
}

function FlashcardForm({ deckId, flashcard, onSaved, onCancel }: FlashcardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      front: flashcard?.front ?? "",
      back: flashcard?.back ?? "",
    },
  });

  const [createFlashcard, { error: createError }] = useMutation<
    AdminCreateFlashcardMutationData,
    AdminCreateFlashcardMutationVars
  >(ADMIN_CREATE_FLASHCARD_MUTATION);
  const [updateFlashcard, { error: updateError }] = useMutation<
    AdminUpdateFlashcardMutationData,
    AdminUpdateFlashcardMutationVars
  >(ADMIN_UPDATE_FLASHCARD_MUTATION);
  const error = createError ?? updateError;

  async function onSubmit(values: FlashcardFormValues) {
    try {
      if (flashcard) {
        await updateFlashcard({ variables: { id: flashcard.id, input: values } });
      } else {
        await createFlashcard({ variables: { input: { deckId, ...values } } });
      }
      onSaved();
    } catch {
      // Surfaced via the reactive `error` state below.
    }
  }

  return (
    <form
      className={`${styles.form} index-card-dashed`}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      {error && (
        <div className={styles.formError} role="alert">
          <span className={styles.formErrorBadge} aria-hidden="true">
            !
          </span>
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Front</span>
        <Controller
          name="front"
          control={control}
          render={({ field }) => (
            <MarkdownEditor value={field.value} onChange={field.onChange} placeholder="Question, term, or prompt" />
          )}
        />
        {errors.front && <span className={styles.fieldError}>{errors.front.message}</span>}
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Back</span>
        <Controller
          name="back"
          control={control}
          render={({ field }) => (
            <MarkdownEditor value={field.value} onChange={field.onChange} placeholder="Answer" />
          )}
        />
        {errors.back && <span className={styles.fieldError}>{errors.back.message}</span>}
      </div>

      <div className={styles.formActions}>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : flashcard ? "Save changes" : "Add flashcard"}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
