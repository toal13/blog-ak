"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, auth } from "@/lib/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
import { MultiImageUpload } from "@/app/components/admin/MultiImageUpload";
import { ImageUpload } from "@/app/components/admin/ImageUpload";
import { Shell } from "@/app/components/admin/Shell";
import { HeaderBar } from "@/app/components/admin/HeaderBar";
import { useAdminSession } from "@/lib/hooks/useAdminSession";

export default function NewPostClient({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  useAdminSession(locale);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");
  const [additionalImages, setAdditionalImages] = useState<
    Array<{ url: string; path: string }>
  >([]);
  const [user, setUser] = useState<{ email: string | null } | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push(`/${locale}/admin`);
        return;
      }
      setUser({ email: u.email });
    });

    return () => unsubAuth();
  }, [locale, router]);

  const logout = async () => {
    await signOut(auth);
    router.push(`/${locale}/admin`);
  };

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
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      // 👇 ドキュメントIDを slug-locale 形式に変更
      const docId = `${data.slug}-${locale}`;

      await setDoc(doc(db, "posts", docId), {
        slug: data.slug, // slugはそのまま保存（言語コードなし）
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
        coverImage: coverImageUrl,
        coverImagePath: coverImagePath,
        images: additionalImages,
      });

      toast.success(`Project created: ${data.slug} (${locale})`);
      router.push(`/${locale}/admin/blog`);
    } catch (e) {
      console.error("[firestore] error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Shell>
      <HeaderBar onSignOut={logout} />
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-sm text-neutral-600 mt-1">
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
              <p className="text-xs text-neutral-600">
                Same slug can be used for all languages (e.g., villa-horizon)
              </p>
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
            <p className="text-xs text-neutral-600">
              Separate tags with commas (e.g., residential, sustainable, wood)
            </p>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <ImageUpload
              projectSlug={watch("slug") || "temp"}
              currentImage={coverImageUrl}
              onImageUploaded={(url, path) => {
                setCoverImageUrl(url);
                setCoverImagePath(path);
              }}
            />
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <MultiImageUpload
              projectSlug={watch("slug") || "temp"}
              currentImages={additionalImages}
              onImagesChange={setAdditionalImages}
              maxImages={10}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(v: "draft" | "published") =>
                setValue("status", v)
              }
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
    </Shell>
  );
}
