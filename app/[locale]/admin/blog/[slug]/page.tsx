"use client";

import { use, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, auth } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
import type { Post } from "@/lib/types/post";
import { ImageUpload } from "@/app/components/admin/ImageUpload";
import { MultiImageUpload } from "@/app/components/admin/MultiImageUpload";
import { Shell } from "@/app/components/admin/Shell";
import { HeaderBar } from "@/app/components/admin/HeaderBar";

type Params = { locale: "sv" | "en" | "ja"; slug: string };

export default function AdminBlogEditPage(props: { params: Promise<Params> }) {
  const { locale, slug } = use(props.params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");
  const [additionalImages, setAdditionalImages] = useState<
    Array<{ url: string; path: string }>
  >([]);
  const [user, setUser] = useState<{ email: string | null } | null>(null);

  // 認証チェック
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
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      slug: "",
      title: "",
      location: "",
      year: new Date().getFullYear(),
      status: "draft",
      description: "",
      content: "",
      tags: "",
    },
  });

  const status = watch("status");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", slug);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          toast.error("Post not found");
          router.push(`/${locale}/admin/blog`);
          return;
        }

        const data = snap.data() as Post;

        reset({
          slug: data.slug,
          title: data.title,
          location: data.location,
          year: data.year,
          description: data.description || "",
          content: data.content || "",
          tags: data.tags?.join(", ") || "",
          status: data.status,
        });
        setCoverImageUrl(data.coverImage || "");
        setCoverImagePath(data.coverImagePath || "");
        setAdditionalImages(data.images || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load post");
        router.push(`/${locale}/admin/blog`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, locale, router, reset]);

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setSaving(true);

    try {
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const docRef = doc(db, "posts", slug);
      await updateDoc(docRef, {
        slug: data.slug,
        title: data.title,
        location: data.location,
        year: data.year,
        description: data.description || "",
        content: data.content || "",
        tags: tagsArray,
        status: data.status,
        updatedAt: serverTimestamp(),
        coverImage: coverImageUrl,
        coverImagePath: coverImagePath,
        images: additionalImages,
      });

      toast.success("Project updated!");
      router.push(`/${locale}/admin/blog`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Shell>
        <HeaderBar onSignOut={logout} />
        <div className="p-6 max-w-3xl mx-auto">
          <p className="text-neutral-600">Loading...</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <HeaderBar onSignOut={logout} />
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Update your architecture project
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Slug (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (read-only)</Label>
            <Input
              id="slug"
              {...register("slug")}
              disabled
              className="bg-neutral-50"
            />
          </div>

          {/* Title */}
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
              projectSlug={slug}
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
              projectSlug={slug}
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
              {saving ? "Saving..." : "Update Project"}
            </Button>
          </div>
        </form>
      </main>
    </Shell>
  );
}
