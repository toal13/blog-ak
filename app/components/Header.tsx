import { getTranslations } from "next-intl/server";
import LocaleSwitch from "./LocaleSwitch";
import Link from "next/link";

export default async function Header({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className="px-2 py-1 text-sm hover:underline">
      {label}
    </Link>
  );

  return (
    <header className="w-full sticky top-0 z-50 bg-[color:var(--beige-bg)]/80 backdrop-blur border-b border-[color:var(--beige-base)]">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        {/* 左：ロゴ */}
        <Link
          href="/"
          className="font-bold tracking-wide text-[color:var(--beige-deep)]"
        >
          Logo
        </Link>

        {/* 中：ナビ */}
        <nav className="hidden md:flex items-center gap-6">
          <Item href="/projects" label={t("projects")} />
          <Item href="/profile" label={t("profile")} />
          <Item href="/contact" label={t("contact")} />
        </nav>
        <LocaleSwitch />
      </div>
    </header>
  );
}
