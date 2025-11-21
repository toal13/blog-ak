"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/client";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  AuthError,
} from "firebase/auth";
import { Shell } from "@/app/components/admin/Shell";
import { ForbiddenCard } from "@/app/components/admin/ForbiddenCard";
import { HeaderBar } from "@/app/components/admin/HeaderBar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLogin } from "@/app/components/admin/AdminLogin";
import { FileText, Plus, FileEdit, CheckCircle } from "lucide-react";
import { useAdminSession } from "@/lib/hooks/useAdminSession"; // 追加

const ALLOWED_EMAILS =
  process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL?.split(",").map((email) =>
    email.trim()
  ) || [];

export default function AdminPage() {
  const params = useParams();
  const locale = params.locale as string;
  // セッション管理を追加
  useAdminSession(locale);

  const [user, setUser] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);

  // 統計情報
  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    published: 0,
  });

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);

    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(false);

      if (u && u.email && !ALLOWED_EMAILS.includes(u.email)) {
        setForbidden(true);
        await signOut(auth);
        setUser(null);
        return;
      }

      if (u && u.email && ALLOWED_EMAILS.includes(u.email)) {
        setForbidden(false);
        setUser({ uid: u.uid, email: u.email });
        return;
      }

      setUser(null);
    });

    return () => unsub();
  }, []);

  // 記事の統計を取得
  useEffect(() => {
    if (!user) return;

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("locale", "==", locale));

    const unsub = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data());

      setStats({
        total: posts.length,
        drafts: posts.filter((p) => p.status === "draft").length,
        published: posts.filter((p) => p.status === "published").length,
      });
    });

    return () => unsub();
  }, [user, locale]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to sign in with Google"
      );
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "code" in e) {
        const errorCode = (e as AuthError).code;
        switch (errorCode) {
          case "auth/invalid-email":
            setError("メールアドレスの形式が正しくありません");
            break;
          case "auth/user-disabled":
            setError("このアカウントは無効化されています");
            break;
          case "auth/user-not-found":
            setError("ユーザーが見つかりません");
            break;
          case "auth/wrong-password":
            setError("パスワードが間違っています");
            break;
          case "auth/invalid-credential":
            setError("メールアドレスまたはパスワードが間違っています");
            break;
          default:
            setError(e instanceof Error ? e.message : "ログインに失敗しました");
        }
      } else {
        setError("ログインに失敗しました");
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminLastActivity");
  };

  if (loading) {
    return (
      <Shell
        variant="card"
        title="Loading"
        description="認証状態を確認しています…"
      />
    );
  }

  if (forbidden) {
    return (
      <Shell variant="card">
        <ForbiddenCard onClose={() => setForbidden(false)} />
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell variant="card" title="Admin Login">
        <AdminLogin
          error={error}
          onSignInWithGoogle={signInWithGoogle}
          onSignInWithEmail={signInWithEmail}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <HeaderBar onSignOut={logout} />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your blog posts and projects
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-neutral-600">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileEdit className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-xs text-neutral-600">Drafts</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-xs text-neutral-600">Published</p>
              </div>
            </div>
          </div>
        </div>

        {/* 新規作成ボタン */}
        <div>
          <Link href={`/${locale}/admin/blog/new`}>
            <div className="group bg-neutral-900 rounded-lg p-5 sm:p-6 hover:bg-neutral-800 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white mb-1">New Post</h2>
                  <p className="text-sm text-neutral-300">
                    Create a new blog post
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* クイックアクセス */}
        <div className="pt-4 sm:pt-6 border-t border-neutral-200 space-y-4">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 下書き */}
            <Link href={`/${locale}/admin/blog?status=draft`}>
              <div className="group bg-amber-50 border border-amber-200 rounded-lg p-4 hover:bg-amber-100 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileEdit className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-amber-900">
                        View Drafts
                      </h3>
                      <p className="text-xs text-amber-700">
                        {stats.drafts} draft posts
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* 公開済み */}
            <Link href={`/${locale}/admin/blog?status=published`}>
              <div className="group bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-green-900">
                        Published Posts
                      </h3>
                      <p className="text-xs text-green-700">
                        {stats.published} live posts
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}
