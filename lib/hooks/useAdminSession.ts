"use client";

import { useEffect, useCallback, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter, usePathname } from "next/navigation";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分（ミリ秒）
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1分ごとにチェック

export function useAdminSession(locale: string) {
  const router = useRouter();
  const pathname = usePathname();
  const lastActivityRef = useRef<number>(Date.now());
  const isInitialMount = useRef(true);

  console.log(
    "🎯 useAdminSession called - locale:",
    locale,
    "pathname:",
    pathname
  );

  // 最終アクティビティ時刻を更新
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    localStorage.setItem("adminLastActivity", Date.now().toString());
  }, []);

  // ログアウト処理
  const handleLogout = useCallback(async () => {
    console.log("🔒 Session expired or left admin area");
    await signOut(auth);
    localStorage.removeItem("adminLastActivity");
    router.push(`/${locale}/admin`);
  }, [locale, router]);

  // Admin外に移動したかチェック
  useEffect(() => {
    // 初回マウント時はスキップ（無限ループ防止）
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log("🔍 Initial mount, current path:", pathname);
      return;
    }

    const isAdminPath = pathname.includes("/admin");
    console.log("🔍 Path changed to:", pathname, "| Is admin?", isAdminPath);

    if (!isAdminPath) {
      console.log("🚪 Left admin area, logging out");
      handleLogout();
    }
  }, [pathname, handleLogout]);

  // セッションタイムアウトのチェック
  useEffect(() => {
    const checkSession = () => {
      const lastActivity = parseInt(
        localStorage.getItem("adminLastActivity") || "0"
      );
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity > SESSION_TIMEOUT) {
        console.log("⏰ Session timeout - logging out");
        handleLogout();
      }
    };

    // 定期的にセッションをチェック
    const intervalId = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [handleLogout]);

  // ユーザーアクティビティを監視
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      updateActivity();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // 初回のアクティビティを記録
    updateActivity();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  return { updateActivity };
}
