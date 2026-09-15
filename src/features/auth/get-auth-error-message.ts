import { CombinedGraphQLErrors } from "@apollo/client/errors";

const MESSAGES_BY_CODE: Record<string, string> = {
  UNAUTHENTICATED: "Invalid email or password.",
  BAD_REQUEST: "Please check the highlighted fields.",
  TOO_MANY_REQUESTS: "Too many attempts — please wait a moment and try again.",
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Maps a failed login mutation's error to copy safe to show a user. */
export function getAuthErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code as string | undefined;
    return (code && MESSAGES_BY_CODE[code]) ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
