"use client";

import { useState } from "react";
import { Menu, X, Instagram } from "lucide-react";
import Link from "next/link";

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

  return (
    <>
      {/* ハンバーガーメニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 md:hidden">
          <nav className="flex flex-col gap-4 p-6">
            <Link
              href={base}
              onClick={() => setIsOpen(false)}
              className="text-sm font-light tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href={`${base}/projects`}
              onClick={() => setIsOpen(false)}
              className="text-sm font-light tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              {translations.projects}
            </Link>
            <Link
              href={`${base}/profile`}
              onClick={() => setIsOpen(false)}
              className="text-sm font-light tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              {translations.profile}
            </Link>
            <Link
              href={`${base}/contact`}
              onClick={() => setIsOpen(false)}
              className="text-sm font-light tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              {translations.contact}
            </Link>
            <a
              href="https://www.instagram.com/your_instagram_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-light tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
