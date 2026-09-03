import { API_ORIGIN } from "./graphql-endpoint";

/** The few REST routes alongside the GraphQL API (file uploads). Add any future REST route here rather than inlining a path string at the call site. */
export const endpoint = {
  attachmentUpload: `${API_ORIGIN}/api/attachments`,
} as const;
