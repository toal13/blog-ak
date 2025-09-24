"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewPostClient({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("SUBMIT fired");
    const form = e.currentTarget;

    const fd = new FormData(e.currentTarget);
    const slug = String(fd.get("slug") ?? "").trim();
    const title = String(fd.get("title") ?? "").trim();
    const content = String(fd.get("content") ?? "");
    const status = String(fd.get("status") ?? "draft");

    try {
      console.log("[firestore] addDoc start");
      const ref = await addDoc(collection(db, "posts"), {
        slug,
        title,
        content,
        status,
        locale,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("[firestore] added id:", ref.id);
      setMsg(`Created: ${ref.id}`);
      form.reset(); // ★ ここを (e.currentTarget as ...) じゃなく form で
    } catch (e) {
      console.error("[firestore] error:", e);
      setErr(e instanceof Error ? e.message : "Failed to create post");
    }
  }

  return (
    <main className="p-6 max-w-2xl space-y-4">
      <h1>NEW FORM v1</h1>
      {msg && <p className="text-green-600">{msg}</p>}
      {err && <p className="text-red-600">{err}</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <input name="slug" placeholder="slug" className="border p-2" required />
        <input
          name="title"
          placeholder="title"
          className="border p-2"
          required
        />
        <button type="submit" className="px-4 py-2 bg-black text-white">
          Publish
        </button>
      </form>
    </main>
  );
}
