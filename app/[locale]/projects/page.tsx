import ProjectsWithFilter from "@/app/components/ProjectsWithFilter";
import { getPublishedProjects } from "@/lib/firebase/posts";

export default async function ProjectsPage(props: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await props.params;

  // すべての公開済みプロジェクトを取得
  const allProjects = await getPublishedProjects(locale);

  return (
    <div className="space-y-8">
      {/* タグフィルター + プロジェクト一覧 */}
      <ProjectsWithFilter projects={allProjects} />
    </div>
  );
}
