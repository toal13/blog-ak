// lib/validations/post.ts
import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Slug cannot start or end with a hyphen",
    }),

  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),

  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters")
    .trim(),

  year: z
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be after 1900")
    .max(
      new Date().getFullYear() + 10,
      `Year must be before ${new Date().getFullYear() + 10}`
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),

  content: z
    .string()
    .max(10000, "Content must be less than 10,000 characters")
    .optional()
    .or(z.literal("")),

  tags: z.string().optional().default(""),

  status: z.enum(["draft", "published"]),
});

// 型定義を手動で調整（tags を string に固定）
export type ProjectFormData = {
  slug: string;
  title: string;
  location: string;
  year: number;
  description?: string;
  content?: string;
  tags?: string; // string のまま（変換は onSubmit で行う）
  status: "draft" | "published";
};
