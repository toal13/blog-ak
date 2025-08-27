// app/[locale]/admin/blog/new/page.tsx
"use client";

import { use } from "react";

type Params = { locale: "sv" | "en" | "ja" };

export default function AdminBlogNewPage(props: { params: Promise<Params> }) {
  const { locale } = use(props.params);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Admin – New Blog Post</h1>
      <p>locale: {locale}</p>

      {/* TODO: ここにフォームを置く（Title, Slug, Status など） */}
    </main>
  );
}
