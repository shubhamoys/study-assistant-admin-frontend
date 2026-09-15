"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { CategoryList } from "@/features/categories/category-list/category-list";
import styles from "./categories.module.scss";

export default function CategoriesPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Categories</h1>
      <p className={styles.subheading}>
        Deleting a category uncategorizes any decks that used it — it never
        blocks the delete.
      </p>
      <CategoryList />
    </AdminShell>
  );
}
