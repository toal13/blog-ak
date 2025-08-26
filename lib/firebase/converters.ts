import {
  Timestamp, // ★ 追加（値として）
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type DocumentData,
} from "firebase/firestore";
import type { Post } from "@/lib/types/post";

type RawPost = Partial<Post> & {
  createdAt?: number | { toMillis(): number };
  updatedAt?: number | { toMillis(): number };
};

// toMillis を持つオブジェクトかどうかの型ガード
function hasToMillis(x: unknown): x is { toMillis: () => number } {
  return (
    typeof x === "object" &&
    x !== null &&
    "toMillis" in x &&
    typeof (x as { toMillis: unknown }).toMillis === "function"
  );
}

// any を使わないミリ秒変換
const toMillis = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (v instanceof Timestamp) return v.toMillis();
  if (hasToMillis(v)) return v.toMillis();
  return 0;
};

export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: Post): DocumentData {
    // Firestoreのフィールドとしては id を含めない
    const { ...out } = post;
    return out as DocumentData;
  },
  fromFirestore(snap: QueryDocumentSnapshot, options: SnapshotOptions): Post {
    const data = snap.data(options) as RawPost;

    return {
      id: data.id ?? snap.id,
      slug: data.slug ?? snap.id,
      title: {
        sv: data.title?.sv ?? snap.id,
        en: data.title?.en,
        ja: data.title?.ja,
      },
      description: data.description,
      content: data.content,
      year: data.year,
      place: data.place,
      coverPath: data.coverPath,
      imagePaths: data.imagePaths,
      tags: data.tags,
      status: data.status ?? "draft",
      authorId: data.authorId,
      createdAt: toMillis(data.createdAt),
      updatedAt: toMillis(data.updatedAt),
    };
  },
};
