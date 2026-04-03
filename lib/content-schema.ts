import { z } from "zod";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must use YYYY-MM-DD")
  .refine((value) => !Number.isNaN(Date.parse(value)), "date must be a valid calendar date");

const nonEmptyStringSchema = z.string().trim().min(1);

export const requiredPostFrontmatterFields = [
  "title",
  "slug",
  "date",
  "summary",
  "tags",
  "published"
] as const;

export const postFrontmatterSchema = z.object({
  title: nonEmptyStringSchema,
  slug: nonEmptyStringSchema,
  date: dateStringSchema,
  summary: nonEmptyStringSchema,
  tags: z.array(nonEmptyStringSchema),
  published: z.boolean(),
  coverImage: nonEmptyStringSchema.optional(),
  discussionId: nonEmptyStringSchema.optional()
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
