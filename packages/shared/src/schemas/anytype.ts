import { z } from 'zod';

export const AnytypeIconSchema = z.object({
  emoji: z.string().optional(),
  image: z.string().optional(),
});

export const AnytypeTypeSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
});

export const AnytypeObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: AnytypeIconSchema.optional(),
  type: AnytypeTypeSchema.optional(),
  snippet: z.string().optional(),
  space_id: z.string(),
  layout: z.string().optional(),
  archived: z.boolean().optional(),
  created_date: z.string().optional(),
  last_modified_date: z.string().optional(),
  blocks: z.array(z.unknown()).optional(),
});
export type AnytypeObject = z.infer<typeof AnytypeObjectSchema>;

export const AnytypePaginationSchema = z.object({
  total: z.number(),
  offset: z.number(),
  limit: z.number(),
  has_next_page: z.boolean(),
});
export type AnytypePagination = z.infer<typeof AnytypePaginationSchema>;

export const AnytypeObjectListResponseSchema = z.object({
  data: z.array(AnytypeObjectSchema),
  pagination: AnytypePaginationSchema,
});
export type AnytypeObjectListResponse = z.infer<typeof AnytypeObjectListResponseSchema>;

export const AnytypeObjectResponseSchema = z.object({
  object: AnytypeObjectSchema,
});
export type AnytypeObjectResponse = z.infer<typeof AnytypeObjectResponseSchema>;

export const AnytypeSpaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: AnytypeIconSchema.optional(),
});
export type AnytypeSpace = z.infer<typeof AnytypeSpaceSchema>;

export const AnytypeSpaceListResponseSchema = z.object({
  data: z.array(AnytypeSpaceSchema),
  pagination: AnytypePaginationSchema,
});
export type AnytypeSpaceListResponse = z.infer<typeof AnytypeSpaceListResponseSchema>;

export const AnytypeCreateObjectBodySchema = z.object({
  name: z.string().min(1),
  body: z.string().optional(),
  type_key: z.string().optional(),
  icon: AnytypeIconSchema.optional(),
});
export type AnytypeCreateObjectBody = z.infer<typeof AnytypeCreateObjectBodySchema>;

export const AnytypeUpdateObjectBodySchema = z.object({
  name: z.string().optional(),
  body: z.string().optional(),
  icon: AnytypeIconSchema.optional(),
}).refine((v) => Object.values(v).some((f) => f !== undefined), {
  message: 'At least one field must be provided',
});
export type AnytypeUpdateObjectBody = z.infer<typeof AnytypeUpdateObjectBodySchema>;

export const AnytypeSearchBodySchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});
export type AnytypeSearchBody = z.infer<typeof AnytypeSearchBodySchema>;
