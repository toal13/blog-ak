import ProjectsWithFilter from "@/app/components/ProjectsWithFilter";
import { getPublishedProjects } from "@/lib/firebase/posts";

export default async function ProjectsPage(props: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await props.params;
  // const t = await getTranslations({ locale, namespace: "projects" });

  // すべての公開済みプロジェクトを取得
  const allProjects = await getPublishedProjects(locale);

  return (
    <div className="space-y-8">
      {/* ページタイトル */}
      {/* <section className="text-center">
        <h1 className="text-4xl font-bold text-black">{t("title")}</h1>
      </section> */}

      {/* タグフィルター + プロジェクト一覧 */}
      <ProjectsWithFilter projects={allProjects} />
    </div>
  );
}
