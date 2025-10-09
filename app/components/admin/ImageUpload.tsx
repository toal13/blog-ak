"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase/client";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FirebaseError } from "firebase/app"; // 👈 追加
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

type Props = {
  projectSlug: string;
  currentImage?: string;
  currentImagePath?: string;
  onImageUploaded: (url: string, path: string) => void;
  label?: string;
};

export function ImageUpload({
  projectSlug,
  currentImage,
  currentImagePath,
  onImageUploaded,
  label = "Cover Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [currentPath, setCurrentPath] = useState<string | null>(
    currentImagePath || null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      // 既存の画像をStorageから削除
      if (currentPath) {
        try {
          const oldImageRef = ref(storage, currentPath);
          await deleteObject(oldImageRef);
          console.log("✅ Old image deleted:", currentPath);
        } catch (error) {
          // 👇 修正：FirebaseError型を使用
          if (
            error instanceof FirebaseError &&
            error.code !== "storage/object-not-found"
          ) {
            console.error("Failed to delete old image:", error);
          }
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const filename = `cover_${timestamp}.${ext}`;
      const storagePath = `projects/${projectSlug}/${filename}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setCurrentPath(storagePath);
      onImageUploaded(downloadURL, storagePath);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentPath) {
      setPreview(null);
      onImageUploaded("", "");
      return;
    }

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeleting(true);

    try {
      const imageRef = ref(storage, currentPath);
      await deleteObject(imageRef);
      console.log("✅ Image deleted from Storage:", currentPath);

      setPreview(null);
      setCurrentPath(null);
      onImageUploaded("", "");
    } catch (error) {
      // 👇 修正：FirebaseError型を使用
      console.error("Delete error:", error);
      if (
        error instanceof FirebaseError &&
        error.code === "storage/object-not-found"
      ) {
        setPreview(null);
        setCurrentPath(null);
        onImageUploaded("", "");
      } else {
        alert("Failed to delete image");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
          <Image
            src={preview}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Choose Image"}
          </Button>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Recommended: 1200x800px or larger. Max 5MB. JPG, PNG, or WebP.
      </p>
    </div>
  );
}
