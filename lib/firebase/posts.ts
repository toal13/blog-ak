// lib/firebase/posts.ts
import { db } from "@/lib/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { postConverter } from "@/lib/firebase/converters";
import type { Post } from "@/lib/types/post";

/**
 * 公開済みのプロジェクトを取得（locale別）
 */
export async function getPublishedProjects(locale: string): Promise<Post[]> {
  try {
    console.log("🔍 Fetching projects for locale:", locale);

    const q = query(
      collection(db, "posts").withConverter(postConverter),
      where("locale", "==", locale),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);
    console.log("✅ Found", snapshot.docs.length, "projects");

    // クライアント側でソート
    const projects = snapshot.docs.map((doc) => doc.data());
    projects.sort((a, b) => b.year - a.year);

    return projects;
  } catch (error) {
    console.error("❌ Failed to fetch projects:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return [];
  }
}

/**
 * 特定のslugのプロジェクトを取得
 */
export async function getProjectBySlug(slug: string): Promise<Post | null> {
  try {
    const docRef = doc(db, "posts", slug).withConverter(postConverter);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data();
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
