"use client";

import { useState } from "react";

type Props = {
  error: string | null;
  onSignInWithGoogle: () => void;
  onSignInWithEmail: (email: string, password: string) => void;
};

export function AdminLogin({
  error,
  onSignInWithGoogle,
  onSignInWithEmail,
}: Props) {
  const [loginMethod, setLoginMethod] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    await onSignInWithEmail(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
        <p className="text-muted-foreground mt-2">
          Googleでサインインしてください（許可済みアカウントのみ）。
        </p>
      </div>

      {/* タブ切り替え */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setLoginMethod("google")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            loginMethod === "google"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          Google
        </button>
        <button
          onClick={() => setLoginMethod("email")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            loginMethod === "email"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          Email / Password
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Googleログイン */}
      {loginMethod === "google" && (
        <button
          onClick={onSignInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      )}

      {/* メール/パスワードログイン */}
      {loginMethod === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      )}

      <p className="text-xs text-muted-foreground text-center">
        このページは非公開です。認証済みの管理者のみ編集できます。
      </p>
    </div>
  );
}
