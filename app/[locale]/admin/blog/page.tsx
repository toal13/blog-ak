"use client";
export const dynamic = "force-dynamic";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { postConverter } from "@/lib/firebase/converters";
import type { Post, PostStatus } from "@/lib/types/post";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostList } from "@/app/components/admin/PostList";

type Params = { locale: "sv" | "en" | "ja" };

export default function AdminBlogList(props: { params: Promise<Params> }) {
  const { locale } = use(props.params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  useEffect(() => {
    const col = collection(db, "posts").withConverter(postConverter);
    const base = query(col, where("locale", "==", locale));
    const q =
      filter === "all"
        ? query(base, orderBy("updatedAt", "desc"))
        : query(
            base,
            where("status", "==", filter),
            orderBy("updatedAt", "desc")
          );

    const unsub = onSnapshot(q, (snap) =>
      setPosts(snap.docs.map((d) => d.data()))
    );
    return () => unsub();
  }, [filter, locale]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl tracking-wide">Posts ({locale})</h1>
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as PostStatus | "all")}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="draft">draft</SelectItem>
              <SelectItem value="published">published</SelectItem>
            </SelectContent>
          </Select>
          {/* ★ locale を必ず含める */}
          <Link href={`/${locale}/admin/blog/new`}>
            <Button>New Post</Button>
          </Link>
        </div>
      </div>
      <PostList items={posts} />
    </div>
  );
}
