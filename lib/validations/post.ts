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
// import { z } from "zod";

// export const projectSchema = z.object({
//   slug: z
//     .string()
//     .min(3, "Slug must be at least 3 characters")
//     .max(50, "Slug must be less than 50 characters")
//     .regex(
//       /^[a-z0-9-]+$/,
//       "Slug can only contain lowercase letters, numbers, and hyphens"
//     )
//     .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
//       message: "Slug cannot start or end with a hyphen",
//     }),

//   title: z
//     .string()
//     .min(1, "Title is required")
//     .max(100, "Title must be less than 100 characters")
//     .trim(),

//   location: z
//     .string()
//     .min(1, "Location is required")
//     .max(100, "Location must be less than 100 characters")
//     .trim(),

//   year: z.coerce
//     .number()
//     .int()
//     .min(1900)
//     .max(new Date().getFullYear() + 10),

//   description: z.string().default(""),
//   content: z.string().default(""),
//   tags: z.string().default(""),
//   status: z.enum(["draft", "published"]),
// });

// export type ProjectFormData = z.infer<typeof projectSchema>;
