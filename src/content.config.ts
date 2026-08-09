import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  series: z.enum(["idrac", "network", "vpn", "site-to-site-vpn", "linux", "telephony", "api", "security", "handson-prep", "virtualization"]),
  order: z.number(),
  tags: z.array(z.string()),
  emoji: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
});

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        choices: z.array(z.string()).length(4),
        answerIndex: z.number().int().min(0).max(3),
        explanation: z.string(),
      })
    )
    .min(1),
});

// ハンズオン記事ごとのFAQ。linkがあれば「詳しくはこちらの記事へ」というリンクを併記する。
const faqSchema = z.object({
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        link: z.object({ url: z.string(), label: z.string() }).optional(),
      })
    )
    .min(1),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: articleSchema,
});

const quizzes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/quizzes" }),
  schema: quizSchema,
});

// 英語版(/en/配下)のコンテンツ。IDは日本語版と同じスラッグを使い、言語切り替え時のURL対応を単純にしている。
const articlesEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles-en" }),
  schema: articleSchema,
});

const quizzesEn = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/quizzes-en" }),
  schema: quizSchema,
});

// FAQファイルはハンズオン記事など一部の記事にのみ存在する(ファイルがなければFAQセクション自体を表示しない)。
const faqs = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/faqs" }),
  schema: faqSchema,
});

const faqsEn = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/faqs-en" }),
  schema: faqSchema,
});

export const collections = { articles, quizzes, articlesEn, quizzesEn, faqs, faqsEn };
