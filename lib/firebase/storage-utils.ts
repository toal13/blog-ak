// src/lib/firebase/storage-utils.ts
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { FirebaseError } from "firebase/app";

export type ImageData = {
  url: string;
  path: string;
};

/**
 * Firebase Storageから単一の画像を削除
 */
export async function deleteImageFromStorage(path: string): Promise<void> {
  if (!path) return;

  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    console.log("✅ Deleted from Storage:", path);
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code === "storage/object-not-found"
    ) {
      console.warn("⚠️ Image not found (already deleted):", path);
    } else {
      console.error("❌ Failed to delete:", path, error);
      throw error;
    }
  }
}

/**
 * 複数の画像を削除（エラーがあっても続行）
 */
export async function deleteMultipleImages(
  images: ImageData[]
): Promise<{ success: number; failed: number }> {
  if (!images || images.length === 0) {
    return { success: 0, failed: 0 };
  }

  let successCount = 0;
  let failedCount = 0;

  const deletePromises = images.map(async (img) => {
    try {
      await deleteImageFromStorage(img.path);
      successCount++;
    } catch (error) {
      console.error("Failed to delete image:", img.path, error); // 👈 修正
      failedCount++;
    }
  });

  await Promise.allSettled(deletePromises);

  return { success: successCount, failed: failedCount };
}

/**
 * 記事に関連する全ての画像を削除
 */
export async function deletePostImages(post: {
  coverImagePath?: string;
  images?: ImageData[];
}): Promise<{ success: number; failed: number }> {
  const imagesToDelete: string[] = [];

  // カバー画像のパス
  if (post.coverImagePath) {
    imagesToDelete.push(post.coverImagePath);
  }

  // 追加画像のパス
  if (post.images && post.images.length > 0) {
    imagesToDelete.push(...post.images.map((img) => img.path));
  }

  // 重複削除
  const uniquePaths = [...new Set(imagesToDelete)];

  console.log(`🗑️ Deleting ${uniquePaths.length} images from Storage...`);

  let successCount = 0;
  let failedCount = 0;

  const deletePromises = uniquePaths.map(async (path) => {
    try {
      await deleteImageFromStorage(path);
      successCount++;
    } catch (error) {
      console.error("Failed to delete:", path, error); // 👈 修正
      failedCount++;
    }
  });

  await Promise.allSettled(deletePromises);

  return { success: successCount, failed: failedCount };
}
