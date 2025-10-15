"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/lib/types/post";
import FeaturedCard from "./FeaturedCard";

export default function ProjectsWithFilter({ projects }: { projects: Post[] }) {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // すべてのタグを収集（重複なし）
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [projects]);

  // フィルタリングされたプロジェクト
  const filteredProjects = useMemo(() => {
    if (selectedTag === "all") {
      return projects;
    }
    return projects.filter((project) => project.tags?.includes(selectedTag));
  }, [projects, selectedTag]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* タグフィルター */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center px-4">
        {/* All ボタン */}
        <button
          onClick={() => setSelectedTag("all")}
          className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-light tracking-wider transition-all ${
            selectedTag === "all"
              ? "bg-black text-white"
              : "bg-white text-black border border-gray-300 hover:border-black"
          }`}
        >
          All
        </button>

        {/* タグボタン */}
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-light tracking-wider transition-all ${
              selectedTag === tag
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:border-black"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* プロジェクト一覧 */}
      {filteredProjects.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <div key={project.slug} className="break-inside-avoid mb-4 md:mb-6">
              <FeaturedCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm md:text-base">
            No projects found with tag &quot;{selectedTag}&quot;
          </p>
        </div>
      )}

      {/* プロジェクト数を表示 */}
      {/* <div className="text-center text-xs md:text-sm text-gray-500">
        Showing {filteredProjects.length} of {projects.length} projects
      </div> */}
    </div>
  );
}
