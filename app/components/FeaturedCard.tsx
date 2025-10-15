"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Post } from "@/lib/types/post";

export default function FeaturedCard({ project }: { project: Post }) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/${project.slug}`}
      className="group block overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow"
      aria-label={`${project.title} – ${project.location} ${project.year}`}
    >
      {/* 画像 */}
      <div className="relative w-full bg-white overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
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
        {/* ホバー時のオーバーレイ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-6">
          <span className="text-center text-black text-base md:text-xl font-light tracking-wide px-4">
            {project.title}
          </span>
          <span className="text-xs md:text-sm text-gray-600 font-light tracking-wide mt-2">
            {project.location}, {project.year}
          </span>
        </div>
      </div>

      {/* 下部メタ */}
      {/* <div className="p-3 text-center border-t border-gray-200">
        <p className="text-sm text-black">
          {project.location}, {project.year}
        </p>
      </div> */}
    </Link>
  );
}
