import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    series: z.enum(["idrac", "network", "api", "security"]),
    order: z.number(),
    tags: z.array(z.string()),
    emoji: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/quizzes" }),
  schema: z.object({
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
  }),
});

export const collections = { articles, quizzes };
