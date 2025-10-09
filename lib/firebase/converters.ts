// lib/firebase/converters.ts
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Post } from "@/lib/types/post";

export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = post;
    return rest;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Post {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      slug: data.slug,
      title: data.title,
      location: data.location,
      year: data.year,
      description: data.description,
      content: data.content,
      coverImage: data.coverImage,
      coverImagePath: data.coverImagePath,
      images: data.images || [],
      tags: data.tags || [],
      locale: data.locale,
      status: data.status,
      // 👇 Timestamp を Date に変換
      createdAt:
        data.createdAt instanceof Object && "toDate" in data.createdAt
          ? (data.createdAt as Timestamp).toDate()
          : undefined,
      updatedAt:
        data.updatedAt instanceof Object && "toDate" in data.updatedAt
          ? (data.updatedAt as Timestamp).toDate()
          : undefined,
    };
  },
};
