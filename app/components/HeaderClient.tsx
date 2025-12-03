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
    <header
      className="w-full sticky top-0 z-[100] bg-white border-gray-200"
      lang={locale}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* 左：ロゴ */}
        <Link
          href={base}
          className="relative h-10 w-auto flex items-center pb-1"
          aria-label="Home"
        >
          <Image
            src="/logo.png"
            alt="Anna Kawai"
            width={240}
            height={48}
            className="h-6 w-auto object-contain hover:opacity-80"
            quality={100}
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
            <span lang={locale}>{translations.projects}</span>
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
            <span lang={locale}>{translations.profile}</span>
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
            <span lang={locale}>{translations.contact}</span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                isActive(`${base}/contact`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        </nav>

        {/* 右：Instagram + 言語切り替え（デスクトップのみ） + モバイルメニュー */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/annakawai_ark/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-black" />
          </a>

          <div className="hidden md:block h-6 w-px bg-gray-300" />

          {/* デスクトップのみ表示 */}
          <div className="hidden md:block">
            <LocaleSwitch />
          </div>

          {/* モバイルメニュー */}
          <MobileMenu locale={locale} translations={translations} />
        </div>
      </div>
    </header>
  );
}
