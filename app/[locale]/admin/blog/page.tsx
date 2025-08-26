// app/[locale]/admin/blog/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
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

export default function AdminBlogList() {
  const [posts, setPosts] = useState<Post[]>([]); // ★ 型を明示
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  useEffect(() => {
    const col = collection(db, "posts").withConverter(postConverter); // ★ converter 付与
    const q =
      filter === "all"
        ? query(col, orderBy("updatedAt", "desc"))
        : query(
            col,
            where("status", "==", filter),
            orderBy("updatedAt", "desc")
          );

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => d.data())); // ★ ここで Post[] になる
    });
    return () => unsub();
  }, [filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl tracking-wide">Posts</h1>
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
          <Link href="../admin/blog/new">
            <Button>New Post</Button>
          </Link>
        </div>
      </div>
      <PostList items={posts} />
    </div>
  );
}
