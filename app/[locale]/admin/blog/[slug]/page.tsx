"use client";

import { use } from "react";

type Params = { locale: "sv" | "en" | "ja"; slug: string };

export default function AdminBlogEditPage(props: { params: Promise<Params> }) {
  const { locale, slug } = use(props.params);
  return (
    <main className="p-6">
      <h1 className="text-xl">Admin – Edit Blog</h1>
      <p>locale: {locale}</p>
      <p>slug: {slug}</p>
    </main>
  );
}
