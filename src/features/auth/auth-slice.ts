import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  /** Flips to true once localStorage has been read on the client, so UI can avoid a flash of "logged out". */
  hydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // The refresh token is never held in Redux state — only localStorage
    // (see auth-token.ts) reads it, from token-refresh.ts. It's still part
    // of this action's payload so the persistence middleware can write both
    // tokens to storage together.
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    /** Populates `user` after rehydrating a token from localStorage (see AuthHydrator) — the token alone doesn't carry the user's details. */
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    hydrateFromStorage: (
      state,
      action: PayloadAction<{ accessToken: string | null }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.hydrated = true;
    },
  },
});

// Note: a silent token-refresh (apollo-client.ts's error link) does NOT
// dispatch anything here — it only ever updates localStorage (see
// token-refresh.ts). Redux's `accessToken` is only read as
// `isAuthenticated = Boolean(accessToken)`, which stays correct either way;
// nothing reads the string value itself out of Redux (every real request
// re-reads the current token from localStorage via getAccessToken()).
export const { setCredentials, clearCredentials, setUser, hydrateFromStorage } =
  authSlice.actions;
export default authSlice.reducer;
