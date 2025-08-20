"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

export type Project = {
  id: string;
  cover: string;
  title: string;
  location: string;
  year: string | number;
  featured?: boolean;
};

export default function FeaturedCard({ project }: { project: Project }) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/${project.id}`}
      className="group block overflow-hidden border border-[color:var(--beige-base)] bg-white"
      aria-label={`${project.title} – ${project.location} ${project.year}`}
    >
      <div className="relative aspect-[16/9] md:aspect-[21/9] bg-white">
        {/* 画像レイヤー：ホバーでフェードアウト */}
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-300 motion-safe:group-hover:opacity-0"
        />
        {/* タイトルレイヤー：ホバーでフェードイン（白背景） */}
        <div className="absolute inset-0 grid place-items-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-center text-[color:var(--beige-deep)] text-xl md:text-3xl font-medium tracking-wide">
            {project.title}
          </span>
        </div>
      </div>

      {/* 常時表示：場所＋年代（カード下） */}
      <div className="mt-3 px-2">
        <p className="text-sm md:text-base text-neutral-700">
          {project.location}, {project.year}
        </p>
      </div>
    </Link>
  );
}
