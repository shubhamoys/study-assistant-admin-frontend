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
    // client-side UX gate that decides what to render.
    isAdmin: user?.role === "ADMIN",
  };
}
