"use client";

import { AuthHydrator } from "./auth-hydrator";
import { ApolloProvider } from "./apollo-provider";
import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ApolloProvider>
          <AuthHydrator>{children}</AuthHydrator>
        </ApolloProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
