// @ts-check
import { defineConfig } from "astro/config";
import { remarkMermaid } from "./src/remark-mermaid.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://koikoi-blog-20260723.vercel.app",
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      excludeLangs: ["mermaid"],
    },
  },
});
