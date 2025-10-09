import { getTranslations } from "next-intl/server";
import LocaleSwitch from "./LocaleSwitch";
import Link from "next/link";
import Image from "next/image";

export default async function Header({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const base = `/${locale}`;

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        {/* 左：ロゴ */}
        <Link
          href={base}
          className="relative h-10 w-auto transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          <Image
            src="/logo.JPG"
            alt="Logo"
            width={150}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* 中：ナビ */}
        <nav className="hidden md:flex items-center gap-12">
          {/* <Link
            href={`${base}/projects`}
            className="text-base font-light tracking-[0.2em] text-black/90 border-b-2 border-transparent hover:border-black/60 transition-colors pb-0.5"
          >
            {t("projects")}
          </Link> */}
          <Link
            href={`${base}/profile`}
            className="text-base font-light tracking-[0.2em] text-black/90 border-b-2 border-transparent hover:border-black/60 transition-colors pb-0.5"
          >
            {t("profile")}
          </Link>
          <Link
            href={`${base}/contact`}
            className="text-base font-light tracking-[0.2em] text-black/90 border-b-2 border-transparent hover:border-black/60 transition-colors pb-0.5"
          >
            {t("contact")}
          </Link>
        </nav>

        <LocaleSwitch />
      </div>
    </header>
  );
}
