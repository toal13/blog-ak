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
import { Shell } from "@/app/components/admin/Shell";
import { LoginCard } from "@/app/components/admin/LoginCard";
import { ForbiddenCard } from "@/app/components/admin/ForbiddenCard";
import { HeaderBar } from "@/app/components/admin/HeaderBar";
import Link from "next/link";
import { useParams } from "next/navigation";

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
        <LoginCard error={error} onSignIn={signInWithGoogle} />
      </Shell>
    );
  }

  return (
    <Shell>
      <HeaderBar email={user.email ?? ""} onSignOut={logout} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              プロジェクトの管理を行います
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link href={`/${locale}/admin/blog`}>
              <div className="rounded-lg border p-6 hover:bg-accent transition-colors">
                <h2 className="text-xl font-semibold mb-2">Posts</h2>
                <p className="text-sm text-muted-foreground">
                  投稿の一覧・作成・編集
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}
