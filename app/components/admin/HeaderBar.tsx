"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Home, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderBar({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();

  // パスからロケールを取得
  const locale = pathname.split("/")[1] || "en";

  // 現在のページを判定
  const isDashboard =
    pathname.includes("/admin") && !pathname.includes("/blog");
  const isBlogList =
    pathname.includes("/admin/blog") && pathname.split("/").length === 4;

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* 左側：ナビゲーション */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded bg-neutral-900" />
            <span className="text-sm font-medium tracking-wider">Admin</span>
          </div>

          {/* ナビゲーションリンク */}
          <nav className="flex items-center gap-1">
            <Link href={`/${locale}/admin`}>
              <button
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isDashboard
                    ? "bg-neutral-100 font-medium"
                    : "hover:bg-neutral-50 text-neutral-600"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </button>
            </Link>
            <Link href={`/${locale}/admin/blog`}>
              <button
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isBlogList
                    ? "bg-neutral-100 font-medium"
                    : "hover:bg-neutral-50 text-neutral-600"
                }`}
              >
                <FileText className="h-4 w-4" />
                All Posts
              </button>
            </Link>
          </nav>
        </div>

        {/* 右側：ログアウトのみ */}
        <div>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
