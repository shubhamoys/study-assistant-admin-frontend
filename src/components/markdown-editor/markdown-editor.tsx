"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "next-themes";
import { commands, type ICommand, type TextAreaTextApi } from "@uiw/react-md-editor";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { uploadAttachment } from "@/lib/upload-attachment";
import styles from "./markdown-editor.module.scss";

// @uiw/react-md-editor measures the DOM (CodeMirror) at mount — not SSR-safe.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

/**
 * Same component as study-assistant-frontend's — wraps @uiw/react-md-editor
 * in edit-only mode (`preview="edit"`). Every actual render of markdown
 * content, including a live preview while editing, goes through
 * `MarkdownContent` instead, so there's exactly one (sanitized) rendering
 * path rather than two.
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  id,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadImage(file: File): Promise<string | null> {
    setUploadError(null);
    const result = await uploadAttachment(file);
    if (!result.ok) {
      setUploadError(result.error);
      return null;
    }
    return result.url;
  }

  const imageCommand: ICommand = {
    name: "upload-image",
    keyCommand: "upload-image",
    buttonProps: { "aria-label": "Insert image", title: "Insert image" },
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm0 9 3.5-4 2.5 3 2-2L16 13H4z" />
      </svg>
    ),
    execute: (_state, api: TextAreaTextApi) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp,image/gif";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        void uploadImage(file).then((url) => {
          if (url) api.replaceSelection(`![${file.name}](${url})`);
        });
      };
      input.click();
    },
  };

  return (
    <div className={styles.wrap}>
      <div data-color-mode={mounted && resolvedTheme === "dark" ? "dark" : "light"}>
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? "")}
          preview="edit"
          height={240}
          visibleDragbar={false}
          textareaProps={{ placeholder, id }}
          commands={[...commands.getCommands(), commands.divider, imageCommand]}
        />
      </div>
      {uploadError && <span className={styles.error}>{uploadError}</span>}
    </div>
  );
}
