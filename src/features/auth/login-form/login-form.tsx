"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input/password-input";
import { useAppDispatch } from "@/lib/redux-hooks";
import { setCredentials } from "../auth-slice";
import { getAuthErrorMessage } from "../get-auth-error-message";
import {
  LOGIN_MUTATION,
  type LoginMutationData,
  type LoginMutationVars,
} from "../graphql";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useRedirectIfAuthenticated } from "../use-redirect-if-authenticated";
import styles from "../auth-form.module.scss";

export function LoginForm() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const reason = searchParams.get("reason");
  // A login that succeeded but wasn't an admin — set directly from onSubmit
  // rather than routed through Redux/AuthHydrator's clear-and-redirect
  // dance, so the rejection is immediate and doesn't depend on a page
  // reload or a protected route's guard ever running.
  const [notAdmin, setNotAdmin] = useState(false);

  // A signed-in admin lands here (e.g. via a bookmark) — send them straight
  // to the dashboard instead of showing the form again.
  useRedirectIfAuthenticated("/dashboard");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [loginMutation, { error }] = useMutation<
    LoginMutationData,
    LoginMutationVars
  >(LOGIN_MUTATION);

  async function onSubmit(values: LoginFormValues) {
    setNotAdmin(false);
    try {
      const { data } = await loginMutation({ variables: { input: values } });
      if (!data) return;
      if (
        data.login.user.role !== "ADMIN" &&
        data.login.user.role !== "SUPER_ADMIN"
      ) {
        // Valid credentials, wrong audience — never even put a non-admin's
        // tokens in Redux/localStorage; there's nothing here for them to do.
        setNotAdmin(true);
        return;
      }
      dispatch(
        setCredentials({
          accessToken: data.login.accessToken,
          refreshToken: data.login.refreshToken,
          user: data.login.user,
        }),
      );
    } catch {
      // Already captured in `error` above (useMutation's reactive state) and
      // rendered as the banner below.
    }
  }

  return (
    <div className={styles.card}>
      <header>
        <span className={styles.eyebrow}>Admin panel</span>
        <h1 className={styles.heading}>Sign in to manage the platform.</h1>
        <p className={styles.subheading}>
          Use your AI Study Assistant admin account.
        </p>
      </header>

      <form
        className={`${styles.fields} index-card`}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        {error && (
          <div className={styles.formError} role="alert">
            <span className={styles.formErrorBadge} aria-hidden="true">
              !
            </span>
            <span>{getAuthErrorMessage(error)}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.fieldError}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <span className={styles.fieldError}>
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {reason === "auth-required" && (
        <div className={styles.formNotice} role="status">
          <span className={styles.formNoticeBadge} aria-hidden="true">
            i
          </span>
          <span>Sign in to continue.</span>
        </div>
      )}

      {(notAdmin || reason === "not-authorized") && (
        <div className={styles.formError} role="alert">
          <span className={styles.formErrorBadge} aria-hidden="true">
            !
          </span>
          <span>
            That account doesn&apos;t have admin access. Sign in with an
            admin account instead.
          </span>
        </div>
      )}
    </div>
  );
}
