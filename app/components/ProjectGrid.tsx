"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

interface Project {
  id: string;
  cover: string;
  title: string;
  location: string;
  year: string | number;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const locale = useLocale();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/${locale}/${p.id}`}
          className="group block overflow-hidden border-[color:var(--beige-base)] bg-white"
          aria-label={`${p.title} – ${p.location} ${p.year}`}
        >
          {/* 画像 */}
          <div className="relative aspect-[4/3] bg-white">
            <Image
              src={p.cover}
              alt={p.title}
              fill
              className="object-cover transition-opacity duration-300 motion-safe:group-hover:opacity-0"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            />

            {/* ホバー時のタイトル（中央表示） */}
            <div className="absolute inset-0 grid place-items-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-center text-[color:var(--beige-deep)] text-lg md:text-2xl font-medium tracking-wide">
                {p.title}
              </span>
            </div>
          </div>

          {/* 常時表示（画像の下にシンプルに出す部分） */}
          <p className="mt-1 text-center text-sm text-foreground">
            {p.location}, {p.year}
          </p>
        </Link>
      ))}
    </div>
  );
}
