// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { remarkMermaid } from "./src/remark-mermaid.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://koikoi-blog-20260723.vercel.app",
  i18n: {
    locales: ["ja", "en"],
    defaultLocale: "ja",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "ja",
        locales: {
          ja: "ja-JP",
          en: "en-US",
        },
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      excludeLangs: ["mermaid"],
    },
  },
});
