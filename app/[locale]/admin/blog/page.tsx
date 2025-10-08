"use client";
export const dynamic = "force-dynamic";

import { use, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase/client";
import { collection, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { postConverter } from "@/lib/firebase/converters";
import type { Post, PostStatus } from "@/lib/types/post";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // URLのクエリパラメータから初期値を取得
  const initialStatus = (searchParams.get("status") as PostStatus) || "all";
  const [filter, setFilter] = useState<PostStatus | "all">(initialStatus);
  const [user, setUser] = useState<{ email: string | null } | null>(null);

  // URLのクエリパラメータが変更されたら、filterを更新
  useEffect(() => {
    const status = (searchParams.get("status") as PostStatus) || "all";
    setFilter(status);
  }, [searchParams]);

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

  // フィルター変更ハンドラー
  const handleFilterChange = (value: PostStatus | "all") => {
    setFilter(value);
    // URLを更新
    if (value === "all") {
      router.push(`/${locale}/admin/blog`);
    } else {
      router.push(`/${locale}/admin/blog?status=${value}`);
    }
  };

  // すべての投稿を取得（インデックス不要）
  useEffect(() => {
    const col = collection(db, "posts").withConverter(postConverter);
    const q = query(col);

    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map((d) => d.data());
      setAllPosts(posts);
    });

    return () => unsub();
  }, []);

  // クライアント側でフィルタリング・ソート
  useEffect(() => {
    let filtered = allPosts
      // ロケールでフィルタ
      .filter((post) => post.locale === locale);

    // ステータスでフィルタ
    if (filter !== "all") {
      filtered = filtered.filter((post) => post.status === filter);
    }

    // updatedAt でソート（新しい順）
    filtered.sort((a, b) => {
      const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
      const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
      return bTime - aTime;
    });

    setFilteredPosts(filtered);
  }, [allPosts, filter, locale]);

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
              {filteredPosts.length} posts in {locale}
            </p>
          </div>
          <Link href={`/${locale}/admin/blog/new`}>
            <Button>New Post</Button>
          </Link>
        </div>

        {/* フィルター */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Filter:</span>
          <Select value={filter} onValueChange={handleFilterChange}>
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
        <PostList items={filteredPosts} locale={locale} />
      </main>
    </Shell>
  );
}
