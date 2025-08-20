import { getTranslations } from "next-intl/server";
import LocaleSwitch from "./LocaleSwitch";
import Link from "next/link";

export default async function Header({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const base = `/${locale}`; // ここを基準に

  return (
    <header className="w-full sticky top-0 z-50 bg-[color:var(--beige-bg)]/80 backdrop-blur border-b border-[color:var(--beige-base)]">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        {/* 左：ロゴ */}
        <Link
          href={base}
          className="text-lg font-light tracking-widest text-[color:var(--beige-deep)]"
        >
          Logo
        </Link>

        {/* 中：ナビ */}
        <nav className="hidden md:flex items-center gap-12">
          <Link
            href={`${base}/projects`}
            className="text-base font-light tracking-[0.2em] text-neutral-800/90 border-b-2 border-transparent hover:border-neutral-800/60 transition-colors pb-0.5"
          >
            {t("projects")}
          </Link>
          <Link
            href={`${base}/profile`}
            className="text-base font-light tracking-[0.2em] text-neutral-800/90 border-b-2 border-transparent hover:border-neutral-800/60 transition-colors pb-0.5"
          >
            {t("profile")}
          </Link>
          <Link
            href={`${base}/contact`}
            className="text-base font-light tracking-[0.2em] text-neutral-800/90 border-b-2 border-transparent hover:border-neutral-800/60 transition-colors pb-0.5"
          >
            {t("contact")}
          </Link>
        </nav>

        <LocaleSwitch />
      </div>
    </header>
  );
}
