"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Post } from "@/lib/types/post";

export default function ProjectGrid({ projects }: { projects: Post[] }) {
  const locale = useLocale();

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/${locale}/${p.slug}`}
          className="group block overflow-hidden  bg-white mb-8 break-inside-avoid hover:shadow-lg transition-shadow"
          aria-label={`${p.title} – ${p.location} ${p.year}`}
        >
          {/* 画像 - Masonryレイアウト */}
          <div className="relative w-full bg-white overflow-hidden">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                width={800}
                height={600}
                className="w-full h-auto"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              />
            ) : (
              <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-400">No Image</span>
              </div>
            )}

            {/* ホバー時のオーバーレイ */}
            <div className="absolute inset-0 grid place-items-center bg-white/95 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-center text-black text-lg md:text-2xl font-medium tracking-wide px-4">
                {p.title}
              </span>
            </div>
          </div>

          {/* 常時表示 */}
          <div className="p-3 text-center border-t border-gray-200">
            <p className="text-sm text-black">
              {p.location}, {p.year}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
