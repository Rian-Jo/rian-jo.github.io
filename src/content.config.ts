import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const normalizeId = (entry: string) => entry.replace(/\\/g, '/').replace(/\.[^.]+$/, '');

const writing = defineCollection({
  loader: glob({
    base: './src/content/writing',
    pattern: '**/*.{md,markdown}',
    generateId: ({ entry }) => normalizeId(entry),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    layout: z.string().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => normalizeId(entry),
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    period: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    systems: z.array(z.string()).default([]),
    links: z
      .object({
        paper: z.string().optional(),
        video: z.string().optional(),
        code: z.string().optional(),
        external: z.string().optional(),
      })
      .default({}),
  }),
});

const publications = defineCollection({
  loader: glob({
    base: './src/content/publications',
    pattern: '**/*.json',
    generateId: ({ entry }) => normalizeId(entry),
  }),
  schema: z.object({
    key: z.string(),
    slug: z.string(),
    type: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    doi: z.string().optional(),
    abstract: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    pages: z.string().optional(),
    featured: z.boolean().default(false),
    links: z.object({
      pdf: z.string().optional(),
      video: z.string().optional(),
      external: z.string().optional(),
    }),
  }),
});

export const collections = {
  writing,
  projects,
  publications,
};
