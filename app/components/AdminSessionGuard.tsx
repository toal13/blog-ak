"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function AdminSessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin以外のページにいる場合、Adminセッションをクリア
    const isAdminPath = pathname.includes("/admin");

    if (!isAdminPath) {
      const lastActivity = localStorage.getItem("adminLastActivity");

      if (lastActivity) {
        console.log("🚪 Non-admin page detected, clearing admin session");

        // Firebaseからログアウト
        signOut(auth).catch(() => {
          // エラーは無視（既にログアウト済みの可能性）
        });

        // セッション情報をクリア
        localStorage.removeItem("adminLastActivity");
      }
    }
  }, [pathname]);

  return null; // 何もレンダリングしない
}
