"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string; // 例: "/projects"
  children: React.ReactNode;
  exact?: boolean; // "/" だけハイライトしたい時などに
}) {
  const locale = useLocale();
  const pathname = usePathname(); // 例: "/ja/projects/xxx"

  const target = `/${locale}${href}`; // 例: "/ja/projects"
  const isActive = exact
    ? pathname === target
    : pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      className={[
        "px-2 py-1 text-sm transition-colors",
        isActive
          ? "text-[color:var(--beige-deep)] underline underline-offset-4"
          : "opacity-70 hover:opacity-100",
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
