import { defaultSchema } from "rehype-sanitize";
import type { Element, Root } from "hast";

const IFRAME_HOSTS = [
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "www.youtube.com",
  "drive.google.com",
  "player.vimeo.com",
];

/**
 * Sanitize schema for product/service markdown. Allows common formatting +
 * a whitelisted iframe (youtube-nocookie / drive.google / vimeo). Strips
 * scripts, styles, and on* event handlers.
 */
export const markdownSchema = {
  ...defaultSchema,
  tagNames: [
    "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "code", "pre", "blockquote",
    "a", "img", "table", "thead", "tbody", "tr", "td", "th",
    "strong", "em", "hr", "br", "div", "span", "iframe",
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    img: [...(defaultSchema.attributes?.img ?? []), "src", "alt", "title"],
    iframe: ["src", "width", "height", "title", "allow", "allowfullscreen", "loading"],
    code: ["className"],
    pre: ["className"],
    span: ["className"],
    div: ["className"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https", "data"],
  },
  strip: ["script", "style"],
} as unknown as typeof defaultSchema;

/**
 * Extra rehype plugin: remove <iframe> whose src host isn't whitelisted.
 * Belt-and-suspenders on top of rehype-sanitize.
 */
export function rehypeIframeAllowlist() {
  return (tree: Root) => {
    visit(tree);
  };
}

function visit(node: import("hast").Node): void {
  const el = node as Element;
  if (el.type === "element" && el.tagName === "iframe") {
    const src = (el.properties?.src as string | undefined) ?? "";
    let host = "";
    try {
      host = new URL(src).hostname;
    } catch {
      host = "";
    }
    if (!IFRAME_HOSTS.includes(host)) {
      el.tagName = "div";
      el.properties = {};
      el.children = [];
      return;
    }
    el.properties = { ...el.properties, sandbox: "allow-scripts allow-same-origin allow-presentation" };
  }
  if ("children" in el && Array.isArray(el.children)) {
    for (const child of el.children) visit(child);
  }
}
