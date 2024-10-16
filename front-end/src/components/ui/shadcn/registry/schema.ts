import * as z from 'zod';

export const blockChunkSchema = z.object({
  code: z.string().optional(),
  component: z.any(),
  container: z
    .object({
      className: z.string().nullish(),
    })
    .optional(),
  description: z.string(),
  file: z.string(),
  name: z.string(),
});

export const registryItemTypeSchema = z.enum([
  'registry:style',
  'registry:lib',
  'registry:example',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
]);

export const registryItemFileSchema = z.union([
  z.string(),
  z.object({
    content: z.string().optional(),
    path: z.string(),
    target: z.string().optional(),
    type: registryItemTypeSchema,
  }),
]);

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    plugins: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
  }),
});

export const registryItemCssVarsSchema = z.object({
  dark: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
});

export const registryEntrySchema = z.object({
  category: z.string().optional(),
  chunks: z.array(blockChunkSchema).optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  docs: z.string().optional(),
  external: z.boolean().optional(),
  files: z.array(registryItemFileSchema).optional(),
  items: z.array(z.string()).optional(),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  source: z.string().optional(),
  subcategory: z.string().optional(),
  tailwind: registryItemTailwindSchema.optional(),
  type: registryItemTypeSchema,
});

export const registrySchema = z.array(registryEntrySchema);

export type RegistryEntry = z.infer<typeof registryEntrySchema>;

export type Registry = z.infer<typeof registrySchema>;

export const blockSchema = registryEntrySchema.extend({
  code: z.string(),
  component: z.any(),
  container: z
    .object({
      className: z.string().nullish(),
      height: z.string().nullish(),
    })
    .optional(),
  highlightedCode: z.string(),
  style: z.enum(['default', 'new-york']),
  type: z.literal('registry:block'),
});

export type Block = z.infer<typeof blockSchema>;

export type BlockChunk = z.infer<typeof blockChunkSchema>;
