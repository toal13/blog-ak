"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Post } from "@/lib/types/post";

export default function ProjectGrid({ projects }: { projects: Post[] }) {
  const locale = useLocale();

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/${locale}/${p.slug}`}
          className="group block overflow-hidden bg-white mb-4 md:mb-6 break-inside-avoid hover:shadow-xl transition-all duration-300"
          aria-label={`${p.title} – ${p.location} ${p.year}`}
        >
          {/* 画像 - アスペクト比を柔軟に */}
          <div className="relative w-full overflow-hidden bg-gray-50">
            {p.coverImage ? (
              <div className="relative w-full min-h-[200px] max-h-[600px]">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-400">No Image</span>
              </div>
            )}

            {/* ホバー時のオーバーレイ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-6">
              <span className="text-center text-black text-base md:text-xl font-light tracking-wide px-4">
                {p.title}
              </span>
              <span className="text-xs md:text-sm text-gray-600 font-light tracking-wide mt-2">
                {p.location}, {p.year}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
