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
import { ImageIcon, X, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

type ImageData = {
  url: string;
  path: string;
};

type Props = {
  projectSlug: string;
  currentImages?: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  maxImages?: number;
};

export function MultiImageUpload({
  projectSlug,
  currentImages = [],
  onImagesChange,
  maxImages = 10,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [images, setImages] = useState<ImageData[]>(currentImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5MB`);
        }

        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image`);
        }

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const ext = file.name.split(".").pop();
        const filename = `img_${timestamp}_${randomStr}.${ext}`;
        const storagePath = `projects/${projectSlug}/${filename}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return { url: downloadURL, path: storagePath };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = async (index: number) => {
    const imageToDelete = images[index];

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeletingIndex(index);

    try {
      const imageRef = ref(storage, imageToDelete.path);
      await deleteObject(imageRef);
      console.log("✅ Image deleted from Storage:", imageToDelete.path);

      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      // 👇 修正：FirebaseError型を使用
      console.error("Delete error:", error);
      if (
        error instanceof FirebaseError &&
        error.code === "storage/object-not-found"
      ) {
        console.warn("Image not found in Storage, removing from list");
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onImagesChange(newImages);
      } else {
        alert("Failed to delete image");
      }
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleRemoveAll = async () => {
    if (images.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete all ${images.length} images? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingAll(true);

    try {
      const deletePromises = images.map(async (img) => {
        try {
          const imageRef = ref(storage, img.path);
          await deleteObject(imageRef);
          console.log("✅ Deleted:", img.path);
        } catch (error) {
          // 👇 修正：FirebaseError型を使用
          if (
            error instanceof FirebaseError &&
            error.code === "storage/object-not-found"
          ) {
            console.warn("Image not found:", img.path);
          } else {
            console.error("Failed to delete:", img.path, error);
          }
        }
      });

      await Promise.allSettled(deletePromises);

      setImages([]);
      onImagesChange([]);
    } catch (error) {
      console.error("Delete all error:", error);
      alert("Failed to delete some images");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>
          Additional Images ({images.length}/{maxImages})
        </Label>
        {images.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveAll}
            disabled={deletingAll}
            className="text-destructive hover:text-destructive"
          >
            {deletingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </>
            )}
          </Button>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={img.path}
              className="relative aspect-video overflow-hidden rounded-lg border group"
            >
              <Image
                src={img.url}
                alt={`Image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={deletingIndex === index || deletingAll}
              >
                {deletingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={uploading || deletingAll}
            onClick={() =>
              document.getElementById("multi-image-upload")?.click()
            }
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Add Images"}
          </Button>
          <Input
            id="multi-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading || deletingAll}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        You can upload up to {maxImages} images. Max 5MB each. JPG, PNG, or
        WebP.
      </p>
    </div>
  );
}
