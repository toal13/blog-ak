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
  id: string; // = slug
  slug: string;
  title: LocalizedText; // sv を必須にして軸を作る
  description?: LocalizedRich;
  content?: LocalizedRich; // Markdown/HTML
  year?: number;
  place?: string; // 地名は単一文字列でOK（必要なら LocalizedText に）
  coverPath?: string;
  imagePaths?: string[];
  tags?: string[]; // タグを多言語にしたければ {sv,en,ja}[] でもOK
  status: PostStatus;
  authorId?: string;
  createdAt: number; // unix millis（扱いやすい）
  updatedAt: number;
};
