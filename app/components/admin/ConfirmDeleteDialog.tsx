"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { deletePostImages } from "@/lib/firebase/storage-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ConfirmDeleteDialog({ slug }: { slug: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setDeleting(true);

    try {
      // 1. 記事データを取得
      const docRef = doc(db, "posts", slug);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Post not found");
        return;
      }

      const postData = docSnap.data();

      // 2. Storage から画像を削除
      console.log("🗑️ Deleting images from Storage...");
      const { success, failed } = await deletePostImages({
        coverImagePath: postData.coverImagePath,
        images: postData.images,
      });

      console.log(`✅ Deleted ${success} images, ${failed} failed`);

      // 3. Firestore からドキュメントを削除
      await deleteDoc(docRef);

      toast.success(`Post deleted successfully! (${success} images removed)`);

      // 4. ページをリフレッシュ
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={deleting}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。記事データと関連する画像がすべて削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
