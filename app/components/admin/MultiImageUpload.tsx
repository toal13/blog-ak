"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, X } from "lucide-react";
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
  const [images, setImages] = useState<ImageData[]>(currentImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // 最大枚数チェック
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // ファイルサイズチェック（5MB）
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5MB`);
        }

        // ファイル形式チェック
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image`);
        }

        // Firebase Storage にアップロード
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
      // input をリセット
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      <Label>
        Additional Images ({images.length}/{maxImages})
      </Label>

      {/* 画像プレビューグリッド */}
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* アップロードボタン */}
      {images.length < maxImages && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
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
            disabled={uploading}
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
