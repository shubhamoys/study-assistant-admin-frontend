import type { Middleware } from "@reduxjs/toolkit";
import {
  clearCredentials,
  setCredentials,
} from "@/features/auth/auth-slice";
import { setTokens } from "./auth-token";

/**
 * Keeps localStorage in sync with the auth slice. Lives in middleware rather
 * than the reducer so reducers stay pure — this is the one place that talks
 * to localStorage on write.
 */
export const authPersistenceMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);

    if (setCredentials.match(action)) {
      setTokens({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      });
    } else if (clearCredentials.match(action)) {
      setTokens(null);
    }

    return result;
  };
