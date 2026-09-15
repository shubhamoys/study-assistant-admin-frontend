import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { resolveAssetUrl } from "@/lib/asset-url";
import styles from "./markdown-content.module.scss";

const components: Components = {
  img: ({ src, alt }) => {
    const resolved =
      typeof src === "string" ? (resolveAssetUrl(src) ?? src) : src;
    // eslint-disable-next-line @next/next/no-img-element -- backend-origin URL.
    return <img src={resolved} alt={alt ?? ""} />;
  },
};

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * Same component as study-assistant-frontend's — the single rendering path
 * for markdown content (deck descriptions, flashcard front/back). `rehype-sanitize`
 * runs before `rehype-highlight` deliberately — see that repo's version of
 * this file for the full reasoning.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={`${styles.content} ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
