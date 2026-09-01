import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

/** Sends an already-logged-in admin away from /login. */
export function useRedirectIfAuthenticated(to = "/") {
  const router = useRouter();
  const { isAdmin, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && isAdmin) {
      router.replace(to);
    }
  }, [hydrated, isAdmin, router, to]);
}
