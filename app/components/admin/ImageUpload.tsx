"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

type Props = {
  projectSlug: string;
  currentImage?: string;
  onImageUploaded: (url: string, path: string) => void;
  label?: string;
};

export function ImageUpload({
  projectSlug,
  currentImage,
  onImageUploaded,
  label = "Cover Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB まで）
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      // プレビュー表示
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Firebase Storage にアップロード
      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const filename = `cover_${timestamp}.${ext}`;
      const storagePath = `projects/${projectSlug}/${filename}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      onImageUploaded(downloadURL, storagePath);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded("", "");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
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
