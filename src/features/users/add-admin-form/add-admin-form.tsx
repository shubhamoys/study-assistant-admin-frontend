"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/password-input/password-input";
import {
  ADMIN_CREATE_ADMIN_USER_MUTATION,
  type AdminCreateAdminUserMutationData,
  type AdminCreateAdminUserMutationVars,
} from "../graphql";
import { addAdminSchema, type AddAdminFormValues } from "../schemas";
import styles from "./add-admin-form.module.scss";

function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "CONFLICT") return "An account with this email already exists.";
    if (code === "BAD_REQUEST") return "Please check the highlighted fields.";
  }
  return "Something went wrong. Please try again.";
}

interface AddAdminFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export function AddAdminForm({ onCreated, onCancel }: AddAdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddAdminFormValues>({ resolver: zodResolver(addAdminSchema) });

  const [createAdmin, { error }] = useMutation<
    AdminCreateAdminUserMutationData,
    AdminCreateAdminUserMutationVars
  >(ADMIN_CREATE_ADMIN_USER_MUTATION);

  async function onSubmit(values: AddAdminFormValues) {
    try {
      await createAdmin({ variables: { input: values } });
      onCreated();
    } catch {
      // Surfaced via the reactive `error` state below.
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <DialogHeader>
        <DialogTitle>Add admin</DialogTitle>
        <DialogDescription>
          Creates a brand-new account with admin access directly — email is
          marked verified automatically since you&apos;re vouching for it.
        </DialogDescription>
      </DialogHeader>

      {error && <p className={styles.error}>{getErrorMessage(error)}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="add-admin-display-name">
          Display name
        </label>
        <Input
          id="add-admin-display-name"
          aria-invalid={Boolean(errors.displayName)}
          {...register("displayName")}
        />
        {errors.displayName && (
          <span className={styles.fieldError}>
            {errors.displayName.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="add-admin-email">
          Email
        </label>
        <Input
          id="add-admin-email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="add-admin-password">
          Password
        </label>
        <PasswordInput
          id="add-admin-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.fieldError}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create admin"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
