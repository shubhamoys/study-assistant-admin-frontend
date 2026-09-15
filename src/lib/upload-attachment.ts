import { endpoint } from "./api-endpoints";
import { getAccessToken } from "./auth-token";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type UploadAttachmentResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/** Shared by MarkdownEditor's "insert image" command and the deck-cover uploader — both hit the same `POST /api/attachments` REST route. */
export async function uploadAttachment(file: File): Promise<UploadAttachmentResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "Please choose a JPEG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image must be 5MB or smaller." };
  }

  try {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(endpoint.attachmentUpload, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) {
      return { ok: false, error: "Upload failed. Please try again." };
    }
    const data: { url: string } = await res.json();
    return { ok: true, url: data.url };
  } catch {
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
