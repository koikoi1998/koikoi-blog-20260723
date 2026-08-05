import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  series: z.enum(["idrac", "network", "vpn", "telephony", "api", "security"]),
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

export const collections = { articles, quizzes, articlesEn, quizzesEn };
