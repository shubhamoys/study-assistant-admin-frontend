import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth-slice";
import { authPersistenceMiddleware } from "./auth-persistence-middleware";

// A store factory (rather than a module-level singleton) so the App Router
// never shares Redux state across requests/users on the server — each client
// render (see src/providers/redux-provider.tsx) gets its own instance.
export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authPersistenceMiddleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
