// lib/validations/post.ts

import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(2035),
  description: z.string(),
  content: z.string(),
  tags: z.string(),
  status: z.enum(["draft", "published"]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
