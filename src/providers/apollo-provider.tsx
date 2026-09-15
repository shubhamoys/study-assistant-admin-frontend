"use client";

import { useState } from "react";
import { ApolloProvider as ApolloClientProvider } from "@apollo/client/react";
import { makeApolloClient } from "@/graphql/apollo-client";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => makeApolloClient());

  return (
    <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
  );
}
