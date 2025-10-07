"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
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
import { FileText, Plus } from "lucide-react";

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL;

export default function AdminPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [user, setUser] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);

    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(false);

      if (u && u.email && u.email !== ALLOWED_EMAIL) {
        setForbidden(true);
        await signOut(auth);
        setUser(null);
        return;
      }

      if (u && u.email === ALLOWED_EMAIL) {
        setForbidden(false);
        setUser({ uid: u.uid, email: u.email });
        return;
      }

      setUser(null);
    });

    return () => unsub();
  }, []);

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
      <Shell variant="card">
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
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your blog posts and projects
          </p>
        </div>

        {/* メインアクション */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 記事一覧 */}
          <Link href={`/${locale}/admin/blog`}>
            <div className="group bg-white border border-neutral-200 rounded-lg p-6 hover:border-[color:var(--beige-deep)] hover:shadow-sm transition-all cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-[color:var(--beige-light)] transition-colors">
                  <FileText className="h-5 w-5 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold mb-1">All Posts</h2>
                  <p className="text-sm text-neutral-600">
                    View, edit, and delete posts
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* 新規作成 */}
          <Link href={`/${locale}/admin/blog/new`}>
            <div className="group bg-neutral-900 rounded-lg p-6 hover:bg-neutral-800 transition-colors cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
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
        <div className="pt-6 border-t border-neutral-200 space-y-3">
          <h2 className="text-sm font-medium text-neutral-500">Quick Access</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${locale}/admin/blog?status=draft`}>
              <button className="px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                View Drafts
              </button>
            </Link>
            <Link href={`/${locale}/admin/blog?status=published`}>
              <button className="px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                Published Posts
              </button>
            </Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}
