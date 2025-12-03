// components/MobileMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, X, Instagram } from "lucide-react";
import Link from "next/link";
import LocaleSwitch from "./LocaleSwitch";

type Translations = {
  projects: string;
  profile: string;
  contact: string;
};

export function MobileMenu({
  locale,
  translations,
}: {
  locale: string;
  translations: Translations;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const base = `/${locale}`;

  // メニューが開いている時に背景のスクロールをブロック
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* ハンバーガーメニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 relative z-[100]"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 背景オーバーレイ（半透明） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[90] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* メニューパネル（右からスライドイン、画面の1/3の幅） */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 min-w-[280px] bg-white border-l border-gray-200 shadow-2xl z-[95] md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#ffffff" }}
      >
        <nav className="flex flex-col gap-6 p-8 pt-20 items-end bg-white h-full">
          <Link
            href={base}
            onClick={() => setIsOpen(false)}
            className="text-base font-light tracking-wider text-black hover:text-gray-600 transition-colors text-right"
          >
            Home
          </Link>
          <Link
            href={`${base}/projects`}
            onClick={() => setIsOpen(false)}
            className="text-base font-light tracking-wider text-black hover:text-gray-600 transition-colors text-right"
          >
            {translations.projects}
          </Link>
          <Link
            href={`${base}/profile`}
            onClick={() => setIsOpen(false)}
            className="text-base font-light tracking-wider text-black hover:text-gray-600 transition-colors text-right"
          >
            {translations.profile}
          </Link>
          <Link
            href={`${base}/contact`}
            onClick={() => setIsOpen(false)}
            className="text-base font-light tracking-wider text-black hover:text-gray-600 transition-colors text-right"
          >
            {translations.contact}
          </Link>

          {/* Instagram リンク */}
          <a
            href="https://www.instagram.com/annakawai_ark/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-light tracking-wider text-black hover:text-gray-600 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </a>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 my-2 w-full" />

          {/* 言語スイッチ */}
          <div className="pt-2">
            <LocaleSwitch />
          </div>
        </nav>
      </div>
    </>
  );
}
