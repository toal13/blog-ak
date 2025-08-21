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
      className="group block overflow-hidden border-[color:var(--beige-base)] bg-white"
      aria-label={`${project.title} – ${project.location} ${project.year}`}
    >
      {/* 画像（ProjectGridと同一） */}
      <div className="relative aspect-[4/3] bg-white">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition-opacity duration-300 motion-safe:group-hover:opacity-0"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        />
        {/* ホバー時タイトル（ProjectGridと同一） */}
        <div className="absolute inset-0 grid place-items-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-center text-[color:var(--beige-deep)] text-lg md:text-2xl font-medium tracking-wide">
            {project.title}
          </span>
        </div>
      </div>

      {/* 下部メタ（ProjectGridと同一） */}
      <p className="mt-1 text-center text-sm text-foreground">
        {project.location}, {project.year}
      </p>
    </Link>
  );
}
