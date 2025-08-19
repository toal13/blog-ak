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
          className="group block overflow-hidden border border-[color:var(--beige-base)] bg-white"
          aria-label={`${p.title} – ${p.location} ${p.year}`}
        >
          <div className="relative aspect-[4/3] bg-white">
            {/* 画像レイヤー：ホバーでフェードアウト */}
            <Image
              src={p.cover}
              alt={p.title}
              fill
              className="object-cover transition-opacity duration-300 motion-safe:group-hover:opacity-0"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              priority={false}
            />

            {/* タイトルレイヤー：ホバーでフェードイン（白背景） */}
            <div className="absolute inset-0 grid place-items-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-center text-[color:var(--beige-deep)] text-lg md:text-2xl font-medium tracking-wide">
                {p.title}
              </span>
            </div>
          </div>

          {/* モバイル（hover不可端末）用の補助表示 */}
          <div className="p-3 md:hidden">
            <h3 className="text-sm font-medium">{p.title}</h3>
            <p className="text-xs opacity-70">
              {p.location}, {p.year}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
