"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { projectSchema, type ProjectFormData } from "@/lib/validations/post";

export default function NewPostClient({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      slug: "",
      title: "",
      location: "",
      year: new Date().getFullYear(),
      description: "",
      content: "",
      tags: "",
      status: "draft",
    },
  });

  const status = watch("status");

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setSaving(true);

    try {
      // tags を配列に変換
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await setDoc(doc(db, "posts", data.slug), {
        slug: data.slug,
        title: data.title,
        location: data.location,
        year: data.year,
        description: data.description || "",
        content: data.content || "",
        tags: tagsArray,
        locale,
        status: data.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success(`Project created: ${data.slug}`);
      router.push(`/${locale}/admin/blog`);
    } catch (e) {
      console.error("[firestore] error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Project</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new architecture project post
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Slug & Title */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="villa-horizon"
              {...register("slug")}
              aria-invalid={!!errors.slug}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">
                {String(errors.slug.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Villa Horizon"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-red-500">
                {String(errors.title.message)}
              </p>
            )}
          </div>
        </div>

        {/* Location & Year */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Gotland, Sweden"
              {...register("location")}
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <p className="text-sm text-red-500">
                {String(errors.location.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">
              Year <span className="text-red-500">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              placeholder="2021"
              {...register("year", { valueAsNumber: true })}
              aria-invalid={!!errors.year}
            />
            {errors.year && (
              <p className="text-sm text-red-500">
                {String(errors.year.message)}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="A brief description of the project..."
            rows={3}
            {...register("description")}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {String(errors.description.message)}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown supported)</Label>
          <Textarea
            id="content"
            placeholder="## Project Details&#10;&#10;Detailed description here..."
            rows={10}
            {...register("content")}
            aria-invalid={!!errors.content}
          />
          {errors.content && (
            <p className="text-sm text-red-500">
              {String(errors.content.message)}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            placeholder="residential, sustainable, wood"
            {...register("tags")}
            aria-invalid={!!errors.tags}
          />
          {errors.tags && (
            <p className="text-sm text-red-500">
              {String(errors.tags.message)}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Separate tags with commas (e.g., residential, sustainable, wood)
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status}
            onValueChange={(v: "draft" | "published") => setValue("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">
              {String(errors.status.message)}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/blog`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Project"}
          </Button>
        </div>
      </form>
    </main>
  );
}
