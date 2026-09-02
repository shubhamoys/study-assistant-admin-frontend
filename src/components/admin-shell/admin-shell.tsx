"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";
import { useAuth } from "@/features/auth/use-auth";
import { useLogout } from "@/features/auth/use-logout";
import styles from "./admin-shell.module.scss";

// Each checkpoint appends its own section here once built. Keeping this a
// plain array rather than reaching for anything fancier.
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/categories", label: "Categories" },
];

/** Wraps every authenticated admin page — sidebar nav + topbar. Assumes the caller has already gated access via useRequireAdmin. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/dashboard" className={styles.brand}>
          AI Study Assistant
          <span className={styles.brandSub}>Admin</span>
        </Link>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              data-active={pathname === link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <ThemeToggle />
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.displayName ?? user?.email}
            </span>
            <span className="tag">{user?.role}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => void logout()}>
            Log out
          </Button>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
