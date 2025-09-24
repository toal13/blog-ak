import { db } from "@/lib/firebase/client";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Post } from "@/lib/types/post";

export async function createPost(
  input: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  const col = collection(db, "posts");
  const payload = {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(col, payload);
  return docRef.id;
}

export async function updatePost(id: string, patch: Partial<Post>) {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}
