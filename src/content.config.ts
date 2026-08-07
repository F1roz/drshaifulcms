import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const procedures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/procedures' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    related: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: 'global.json', base: './src/content/settings' }),
  schema: z.object({
    brandName: z.string(),
    brandRole: z.string(),
    footerTagline: z.string(),
    social: z.object({
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
    }),
    copyright: z.string(),
    disclaimer: z.string(),
  }),
});

export const collections = { pages, procedures, settings };
