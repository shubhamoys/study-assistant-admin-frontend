import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

/**
 * Guards a page that requires a signed-in ADMIN. Three outcomes once
 * rehydration has settled:
 *  - no token at all → /login (auth-required)
 *  - a token, but `me` resolved to a non-ADMIN role → /login (not-authorized);
 *    AuthHydrator has already cleared the (useless here) credentials by the
 *    time this fires, same as the "no token" case, just a different message
 *  - a token whose `me` hasn't resolved yet → render nothing, wait
 *
 * `isReady` only ever becomes true for a confirmed admin — never for "token
 * present, role not confirmed yet" — so protected content can't flash for a
 * non-admin during that brief window. The server-side RBAC guard on every
 * admin-only resolver is the real security boundary regardless; this is the
 * UX gate.
 */
export function useRequireAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      const params = new URLSearchParams({
        reason: "auth-required",
        redirect: pathname,
      });
      router.replace(`/login?${params.toString()}`);
    } else if (user && !isAdmin) {
      router.replace("/login?reason=not-authorized");
    }
  }, [hydrated, isAuthenticated, isAdmin, user, router, pathname]);

  return { isReady: hydrated && isAuthenticated && isAdmin };
}
