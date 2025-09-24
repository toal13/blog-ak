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
import { PostEditor } from "@/app/components/admin/PostEditor";

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL;

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
      <HeaderBar
        email={user.email ?? ""}
        // photoURL={user.photoURL ?? undefined}
        onSignOut={logout}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <PostEditor />
      </main>
    </Shell>
  );
}
