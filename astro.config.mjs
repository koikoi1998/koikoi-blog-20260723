// @ts-check
import { defineConfig } from "astro/config";
import { remarkMermaid } from "./src/remark-mermaid.mjs";

// https://astro.build/config
export default defineConfig({
  // TODO: Vercelでの公開ドメインが決まったら書き換える
  site: "https://example.com",
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      excludeLangs: ["mermaid"],
    },
  },
});
