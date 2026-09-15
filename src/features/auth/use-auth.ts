import { useAppSelector } from "@/lib/redux-hooks";

export function useAuth() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  return {
    accessToken,
    user,
    hydrated,
    isAuthenticated: Boolean(accessToken),
    // The server-side RBAC guard is the real security boundary (every
    // admin-only resolver checks this independently) — this is only the
    // client-side UX gate that decides what to render. A super admin can
    // do everything a plain admin can, plus add/remove other admins
    // (gated separately by isSuperAdmin) — see UserRole's backend doc
    // comment for why SUPER_ADMIN is a strict superset, not a sibling.
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    isSuperAdmin: user?.role === "SUPER_ADMIN",
  };
}
