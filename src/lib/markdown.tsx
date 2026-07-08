import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { markdownSchema, rehypeIframeAllowlist } from "@/lib/sanitize";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeSanitize, markdownSchema],
          rehypeIframeAllowlist,
          rehypeHighlight,
        ]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
