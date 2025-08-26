"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const ALLOWED_EMAIL = "tomoyo.tomoyo.m@gmail.com";

export default function AdminPage() {
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

      // 1) ログイン済みかつ許可メールでない → 拒否 & 403維持
      if (u && u.email && u.email !== ALLOWED_EMAIL) {
        setForbidden(true);
        await signOut(auth); // サインアウトしても forbidden は維持
        setUser(null);
        return;
      }

      // 2) 許可メールでログイン → 403解除
      if (u && u.email === ALLOWED_EMAIL) {
        setForbidden(false);
        setUser({ uid: u.uid, email: u.email });
        return;
      }

      // 3) 未ログイン（u=null）：403は変更しない（=拒否直後は403のまま表示）
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

  const logout = async () => {
    await signOut(auth);
    // 明示的に403を解除したい場合はここで setForbidden(false) してもOK
  };

  const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-dvh bg-[var(--beige-bg)]">
      <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[color:var(--beige-base)] bg-white/80 p-6 shadow-sm backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );

  //   const Avatar = useMemo(() => {
  //     if (!user?.photoURL) return null;
  //     return (
  //       <img
  //         src={user.photoURL}
  //         alt="avatar"
  //         className="h-9 w-9 rounded-full border border-[color:var(--beige-base)] object-cover"
  //       />
  //     );
  //   }, [user?.photoURL]);

  if (loading) {
    return (
      <Shell>
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
        </div>
      </Shell>
    );
  }

  if (forbidden) {
    return (
      <Shell>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl tracking-wide">403 Forbidden</h1>
            <p className="text-sm text-neutral-600">
              許可されたアカウントのみアクセスできます。
            </p>
          </div>
          <button
            onClick={() => setForbidden(false)}
            className="w-full rounded-lg border border-[color:var(--beige-base)] bg-white px-4 py-2 text-sm tracking-wide hover:bg-[var(--beige-bg)] active:scale-[0.99] transition"
          >
            OK
          </button>
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl tracking-wide">Admin Login</h1>
            <p className="text-sm text-neutral-600">
              Googleでサインインしてください（許可済みアカウントのみ）。
            </p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--beige-base)] bg-white px-4 py-2 text-sm tracking-wide hover:bg-[var(--beige-bg)] active:scale-[0.99] transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" aria-hidden>
              <path
                fill="#4285f4"
                d="M533.5 278.4a320 320 0 0 0-5.1-57.3H272.1v108.5h146.9a125.7 125.7 0 0 1-54.6 82.5v68h88.3c51.6-47.6 80.8-117.8 80.8-201.7z"
              />
              <path
                fill="#34a853"
                d="M272.1 544.3c73.1 0 134.4-24.1 179.2-65.1l-88.3-68c-24.5 16.5-55.8 26.1-90.9 26.1-69.8 0-128.9-47.1-150.1-110.4H31.6v69.8A272.1 272.1 0 0 0 272.1 544.3z"
              />
              <path
                fill="#fbbc04"
                d="M121.9 326.9c-5.6-16.5-8.8-34.2-8.8-52.4s3.2-35.9 8.8-52.4V152.3H31.6A272.1 272.1 0 0 0 0 274.5c0 43.9 10.5 85.3 31.6 122.2l90.3-69.8z"
              />
              <path
                fill="#ea4335"
                d="M272.1 108.6c39.7 0 75.3 13.7 103.2 40.5l77.4-77.4C406.5 25.1 345.2 0 272.1 0A272.1 272.1 0 0 0 31.6 152.3l90.3 69.8c21.2-63.3 80.3-113.5 150.2-113.5z"
              />
            </svg>
            Continue with Google
          </button>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-[11px] leading-5 text-neutral-500">
            このページは非公開です。認証済みの管理者のみ編集できます。
          </p>
        </div>
      </Shell>
    );
  }

  // ログイン後（管理UIのヘッダ＆プレースホルダー）
  return (
    <div className="min-h-dvh]">
      <header className="sticky top-0 z-10 border-b border-[color:var(--beige-base)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded bg-[color:var(--beige-deep)]" />
            <p className="text-sm tracking-wider">Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-neutral-600">{user.email}</div>
            <button
              onClick={logout}
              className="rounded-lg border border-[color:var(--beige-base)] bg-white px-3 py-1.5 text-xs tracking-wide hover:bg-[var(--beige-bg)] active:scale-[0.99] transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-2xl border border-[color:var(--beige-base)] bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg tracking-wide">New Post</h2>
          <p className="mb-6 text-sm text-neutral-600">
            ここにブログ投稿フォームを追加します（タイトル / 本文 / 公開状態 /
            カバー画像）。
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-neutral-600">
                Slug
              </label>
              <input
                className="w-full rounded-lg border border-[color:var(--beige-base)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--beige-base)]/60"
                placeholder="my-first-post"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-neutral-600">
                Title (sv)
              </label>
              <input
                className="w-full rounded-lg border border-[color:var(--beige-base)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--beige-base)]/60"
                placeholder="Titel"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-lg border border-[color:var(--beige-base)] bg-white px-4 py-2 text-sm tracking-wide hover:bg-[var(--beige-bg)] active:scale-[0.99] transition">
              Save draft
            </button>
            <button className="rounded-lg border border-[color:var(--beige-deep)] bg-[color:var(--beige-deep)] px-4 py-2 text-sm tracking-wide text-white hover:brightness-95 active:scale-[0.99] transition">
              Publish
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
