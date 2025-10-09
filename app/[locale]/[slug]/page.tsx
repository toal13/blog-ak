import { getProjectBySlug } from "@/lib/firebase/posts";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default async function ProjectDetailPage(props: {
  params: Promise<{ locale: "sv" | "en" | "ja"; slug: string }>;
}) {
  const { locale, slug } = await props.params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  // すべての画像（カバー + 追加画像）
  const allImages = [
    ...(project.coverImage ? [{ url: project.coverImage, path: "cover" }] : []),
    ...(project.images || []),
  ];

  return (
    <div className="min-h-screen ">
      {/* メインコンテンツ：2カラム */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12">
          {/* 左側：プロジェクト情報 */}
          <div className="space-y-6">
            {/* タイトル */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[color:var(--beige-deep)]">
                {project.title}
              </h1>
              <p className="text-lg text-neutral-600">{project.location}</p>
              <p className="text-sm text-neutral-500">{project.year}</p>
            </div>

            {/* 区切り線 */}
            <hr className="border-[color:var(--beige-base)]" />

            {/* 説明文 */}
            {project.description && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Description
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* 詳細コンテンツ（Markdown） */}
            {project.content && (
              <div className="prose prose-neutral max-w-none">
                <ReactMarkdown>{project.content}</ReactMarkdown>
              </div>
            )}

            {/* タグ */}
            {project.tags && project.tags.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-[color:var(--beige-base)] text-[color:var(--beige-deep)] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右側：画像ギャラリー（縦写真対応） */}
          <div className="space-y-6">
            {allImages.length > 0 ? (
              allImages.map((img, i) => (
                <div
                  key={img.path}
                  className="w-full bg-white border border-[color:var(--beige-base)] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={img.url}
                    alt={`${project.title} - Photo ${i + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-[4/3] bg-neutral-100 border border-[color:var(--beige-base)] flex items-center justify-center">
                <p className="text-neutral-400">No images available</p>
              </div>
            )}
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="mt-12">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </Link>
        </div>
      </main>
    </div>
  );
}
