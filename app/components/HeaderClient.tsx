// components/HeaderClient.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import LocaleSwitch from "./LocaleSwitch";
import { MobileMenu } from "./MobileMenu";

export default function HeaderClient({
  locale,
  translations,
}: {
  locale: "sv" | "en" | "ja";
  translations: {
    projects: string;
    profile: string;
    contact: string;
  };
}) {
  const pathname = usePathname();
  const base = `/${locale}`;

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* 左：ロゴ */}
        <Link
          href={base}
          className="relative h-10 w-auto transition-opacity hover:opacity-80 flex items-center pb-1"
          aria-label="Home"
        >
          <Image
            src="/logo.JPG"
            alt="Anna Kawai"
            width={100}
            height={35}
            className="h-4 w-auto object-contain"
            priority
          />
        </Link>

        {/* 中央：ナビゲーション（デスクトップのみ） */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link
            href={`${base}/projects`}
            className={`text-base font-light tracking-wider transition-colors relative group ${
              isActive(`${base}/projects`)
                ? "text-black font-normal"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {translations.projects}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                isActive(`${base}/projects`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
          <Link
            href={`${base}/profile`}
            className={`text-base font-light tracking-wider transition-colors relative group ${
              isActive(`${base}/profile`)
                ? "text-black font-normal"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {translations.profile}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                isActive(`${base}/profile`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
          <Link
            href={`${base}/contact`}
            className={`text-base font-light tracking-wider transition-colors relative group ${
              isActive(`${base}/contact`)
                ? "text-black font-normal"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {translations.contact}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                isActive(`${base}/contact`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        </nav>

        {/* 右：Instagram + 言語切り替え + モバイルメニュー */}
        <div className="flex items-center gap-4">
          {/* Instagram アイコン（デスクトップのみ） */}
          <a
            href="https://www.instagram.com/your_instagram_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-black" />
          </a>

          {/* 区切り線（デスクトップのみ） */}
          <div className="hidden md:block h-6 w-px bg-gray-300" />

          {/* 言語切り替え */}
          <LocaleSwitch />

          {/* モバイルメニュー（モバイルのみ） */}
          <MobileMenu locale={locale} translations={translations} />
        </div>
      </div>
    </header>
  );
}
