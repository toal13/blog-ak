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
 * 公開済みのプロジェクトを取得(locale別)
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
 * 特定のslugとlocaleのプロジェクトを取得
 * ドキュメントIDは "{slug}-{locale}" の形式
 */
export async function getProjectBySlug(
  slug: string,
  locale: string
): Promise<Post | null> {
  try {
    // ドキュメントIDを slug-locale 形式で構築
    const docId = `${slug}-${locale}`;
    const docRef = doc(db, "posts", docId).withConverter(postConverter);
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

/**
 * オプション: slugだけで全言語のプロジェクトを取得
 */
export async function getProjectAllLocales(slug: string): Promise<Post[]> {
  try {
    const q = query(
      collection(db, "posts").withConverter(postConverter),
      where("slug", "==", slug),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Failed to fetch project variants:", error);
    return [];
  }
}
