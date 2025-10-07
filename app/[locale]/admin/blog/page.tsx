"use client";
export const dynamic = "force-dynamic";

import { use, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { postConverter } from "@/lib/firebase/converters";
import type { Post, PostStatus } from "@/lib/types/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostList } from "@/app/components/admin/PostList";
import { Shell } from "@/app/components/admin/Shell";
import { HeaderBar } from "@/app/components/admin/HeaderBar";

type Params = { locale: "sv" | "en" | "ja" };

export default function AdminBlogList(props: { params: Promise<Params> }) {
  const { locale } = use(props.params);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [user, setUser] = useState<{ email: string | null } | null>(null);

  // 認証チェック
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push(`/${locale}/admin`);
        return;
      }
      setUser({ email: u.email });
    });

    return () => unsubAuth();
  }, [locale, router]);

  const logout = async () => {
    await signOut(auth);
    router.push(`/${locale}/admin`);
  };

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

  if (!user) {
    return null;
  }

  return (
    <Shell>
      <HeaderBar onSignOut={logout} />
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">All Posts</h1>
            <p className="text-sm text-neutral-600 mt-1">
              {posts.length} posts in {locale}
            </p>
          </div>
          <Link href={`/${locale}/admin/blog/new`}>
            <Button>New Post</Button>
          </Link>
        </div>

        {/* フィルター */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Filter:</span>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as PostStatus | "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 記事リスト */}
        <PostList items={posts} locale={locale} />
      </main>
    </Shell>
  );
}
