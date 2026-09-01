"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { hydrateFromStorage } from "@/features/auth/auth-slice";
import { getAccessToken } from "@/lib/auth-token";
import { makeStore } from "@/lib/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  useEffect(() => {
    store.dispatch(hydrateFromStorage({ accessToken: getAccessToken() }));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
