// lib/types/post.ts
export type Locale = "sv" | "en" | "ja";
export type PostStatus = "draft" | "published";

export type LocalizedText = {
  sv: string; // 必須（デフォルト言語）
  en?: string;
  ja?: string;
};

export type LocalizedRich = {
  sv?: string; // 本文などは空でもOK
  en?: string;
  ja?: string;
};

export type Post = {
  id: string; // Firestore document ID
  slug: string; // URL用
  title: string; // プロジェクト名
  location: string; // 場所（例: "Gotland, Sweden"）
  year: number; // 年（例: 2021）
  description: string; // 短い説明
  content?: string; // 詳細な本文（Markdown）
  coverImage?: string; // カバー画像のURL or Path
  images?: string[]; // 追加画像のURL or Path配列
  tags?: string[]; // タグ
  locale: Locale; // 言語
  status: PostStatus; // 公開状態
  createdAt?: Date;
  updatedAt?: Date;
};
