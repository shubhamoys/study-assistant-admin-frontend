"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { clearCredentials, setUser } from "@/features/auth/auth-slice";
import { ME_QUERY, type MeQueryData } from "@/features/auth/graphql";
import { useAppDispatch } from "@/lib/redux-hooks";
import { useAuth } from "@/features/auth/use-auth";

/**
 * localStorage only stores the access token (see auth-token.ts), not the
 * user's details — after a token is rehydrated into Redux on page load, fetch
 * `me` to populate `user`. If the token turns out to be expired/invalid, or
 * belongs to a non-admin account (a `me.role` other than "ADMIN"/"SUPER_ADMIN"
 * — e.g. a regular user's token, or an admin who got demoted since they last
 * logged in here), log out cleanly rather than leaving a session an
 * admin-only resolver would just 403 anyway.
 */
export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken, user, hydrated } = useAuth();

  const { data, error } = useQuery<MeQueryData>(ME_QUERY, {
    skip: !hydrated || !accessToken || Boolean(user),
  });

  useEffect(() => {
    if (!data?.me) return;
    if (data.me.role !== "ADMIN" && data.me.role !== "SUPER_ADMIN") {
      dispatch(clearCredentials());
      return;
    }
    dispatch(setUser(data.me));
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearCredentials());
    }
  }, [error, dispatch]);

  return children;
}
