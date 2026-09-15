"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  type Category,
  type CategoriesQueryData,
  type CreateCategoryMutationData,
  type CreateCategoryMutationVars,
  type DeleteCategoryMutationData,
  type DeleteCategoryMutationVars,
  type UpdateCategoryMutationData,
  type UpdateCategoryMutationVars,
} from "../graphql";
import { categorySchema, type CategoryFormValues } from "../schemas";
import styles from "./category-list.module.scss";

function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "CONFLICT") return "A category with this name already exists.";
    if (code === "BAD_REQUEST") return "Please check the highlighted fields.";
    if (code === "NOT_FOUND") return "This category no longer exists.";
  }
  return "Something went wrong. Please try again.";
}

function CategoryForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: { name: string; description: string | null };
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? undefined,
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && (
          <span className={styles.fieldError}>{errors.name.message}</span>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Description (optional)</label>
        <Input {...register("description")} />
      </div>
      <div className={styles.formActions}>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export function CategoryList() {
  const { data, loading, error, refetch } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const [createCategory] = useMutation<
    CreateCategoryMutationData,
    CreateCategoryMutationVars
  >(CREATE_CATEGORY_MUTATION);
  const [updateCategory] = useMutation<
    UpdateCategoryMutationData,
    UpdateCategoryMutationVars
  >(UPDATE_CATEGORY_MUTATION);
  const [deleteCategory, { loading: deleting }] = useMutation<
    DeleteCategoryMutationData,
    DeleteCategoryMutationVars
  >(DELETE_CATEGORY_MUTATION);

  async function handleCreate(values: CategoryFormValues) {
    setMutationError(null);
    try {
      await createCategory({ variables: { input: values } });
      setShowCreate(false);
      await refetch();
    } catch (mutationErr) {
      setMutationError(getErrorMessage(mutationErr));
    }
  }

  async function handleUpdate(id: string, values: CategoryFormValues) {
    setMutationError(null);
    try {
      await updateCategory({ variables: { id, input: values } });
      setEditingId(null);
      await refetch();
    } catch (mutationErr) {
      setMutationError(getErrorMessage(mutationErr));
    }
  }

  async function handleDelete(category: Category) {
    if (
      !window.confirm(
        `Delete "${category.name}"? Decks in this category will become uncategorized.`,
      )
    ) {
      return;
    }
    setMutationError(null);
    try {
      await deleteCategory({ variables: { id: category.id } });
      await refetch();
    } catch (mutationErr) {
      setMutationError(getErrorMessage(mutationErr));
    }
  }

  const editingCategory = data?.categories.find((c) => c.id === editingId);

  return (
    <div>
      <div className={styles.header}>
        <Button type="button" onClick={() => setShowCreate(true)}>
          New category
        </Button>
      </div>

      <Dialog
        open={showCreate}
        onOpenChange={(open) => {
          setShowCreate(open);
          if (open) setMutationError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New category</DialogTitle>
          </DialogHeader>
          {mutationError && (
            <p className={styles.statusError}>{mutationError}</p>
          )}
          <CategoryForm submitLabel="Create" onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
          else setMutationError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              The slug is derived from the name automatically and can&apos;t
              be edited directly.
            </DialogDescription>
          </DialogHeader>
          {mutationError && (
            <p className={styles.statusError}>{mutationError}</p>
          )}
          {editingCategory && (
            <CategoryForm
              initial={editingCategory}
              submitLabel="Save"
              onSubmit={(values) => handleUpdate(editingCategory.id, values)}
              onCancel={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {mutationError && !showCreate && editingId === null && (
        <p className={styles.statusError}>{mutationError}</p>
      )}
      {loading && <p className={styles.status}>Loading categories…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load categories. Please check your connection and try again.
        </p>
      )}

      <div className={styles.grid}>
        {data?.categories.map((category) => (
          <div key={category.id} className={`${styles.item} index-card`}>
            <div className={styles.itemBody}>
              <h3 className={styles.itemName}>{category.name}</h3>
              <span className={styles.itemSlug}>{category.slug}</span>
              {category.description && (
                <p className={styles.itemDescription}>
                  {category.description}
                </p>
              )}
            </div>
            <div className={styles.itemActions}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingId(category.id)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={() => void handleDelete(category)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
