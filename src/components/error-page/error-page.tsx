import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import styles from "./error-page.module.scss";

interface ErrorPageProps {
  /** A short stamp-style label, e.g. "404" or "Error" — purely decorative. */
  eyebrow: string;
  heading: string;
  message: string;
  children: ReactNode;
}

/**
 * Shared full-page layout for not-found.tsx and error.tsx. Deliberately
 * does NOT use AdminShell — that assumes an authenticated admin (user info,
 * logout button, sidebar nav), which may not hold here (a bad URL can be
 * hit before logging in). Just the logo + message, matching the main app's
 * equivalent component.
 */
export function ErrorPage({ eyebrow, heading, message, children }: ErrorPageProps) {
  return (
    <div className={styles.page}>
      <Link href="/dashboard" className={styles.logoLink}>
        <Logo />
      </Link>
      <div className={`${styles.card} index-card`}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>{children}</div>
      </div>
    </div>
  );
}
