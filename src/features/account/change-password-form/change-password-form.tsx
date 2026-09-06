"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input/password-input";
import {
  CHANGE_PASSWORD_MUTATION,
  type ChangePasswordMutationData,
  type ChangePasswordMutationVars,
} from "@/features/auth/graphql";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas";
import authFormStyles from "@/features/auth/auth-form.module.scss";
import styles from "../account-view/account-view.module.scss";

function getChangePasswordErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "UNAUTHENTICATED") return "Current password is incorrect.";
  }
  return "Something went wrong. Please try again.";
}

/** Mirrors the main app's identical component — same ChangePassword mutation, same backend. */
export function ChangePasswordForm() {
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [changePasswordMutation, { error }] = useMutation<
    ChangePasswordMutationData,
    ChangePasswordMutationVars
  >(CHANGE_PASSWORD_MUTATION);

  async function onSubmit(values: ChangePasswordFormValues) {
    setSucceeded(false);
    try {
      await changePasswordMutation({
        variables: {
          input: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        },
      });
      setSucceeded(true);
      reset();
    } catch {
      // Surfaced via the reactive `error` state below.
    }
  }

  return (
    <section className={`${styles.section} index-card`}>
      <h2 className={styles.sectionTitle}>Change password</h2>

      <form
        className={authFormStyles.fields}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        {error && (
          <div className={authFormStyles.formError} role="alert">
            <span className={authFormStyles.formErrorBadge} aria-hidden="true">
              !
            </span>
            <span>{getChangePasswordErrorMessage(error)}</span>
          </div>
        )}

        {succeeded && (
          <div className={styles.successNotice} role="status">
            Password changed. You&apos;ve been logged out everywhere else for
            safety.
          </div>
        )}

        <div className={authFormStyles.field}>
          <label className={authFormStyles.fieldLabel} htmlFor="currentPassword">
            Current password
          </label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <span className={authFormStyles.fieldError}>
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div className={authFormStyles.field}>
          <label className={authFormStyles.fieldLabel} htmlFor="newPassword">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.newPassword)}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className={authFormStyles.fieldError}>
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className={authFormStyles.field}>
          <label
            className={authFormStyles.fieldLabel}
            htmlFor="confirmPassword"
          >
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className={authFormStyles.fieldError}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className={styles.sectionButton}>
          {isSubmitting ? "Changing…" : "Change password"}
        </Button>
      </form>
    </section>
  );
}
