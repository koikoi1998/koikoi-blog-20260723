import { visit } from "unist-util-visit";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Converts ```mermaid code fences into raw <pre class="mermaid"> blocks so
 * Shiki never syntax-highlights them; mermaid.js renders them client-side
 * (see src/layouts/BaseLayout.astro).
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid" || !parent) return;
      parent.children[index] = {
        type: "html",
        value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`,
      };
    });
  };
}
