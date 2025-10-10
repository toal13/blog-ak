import ProjectGrid from "@/app/components/ProjectGrid";
import { getPublishedProjects } from "@/lib/firebase/posts";

export default async function ProjectsIndex(props: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await props.params;

  // Firestore から公開済みのプロジェクトを取得
  const projects = await getPublishedProjects(locale);

  return (
    <section className="space-y-6">
      {/* <h1 className="text-2xl font-bold">{t("title")}</h1> */}
      <ProjectGrid projects={projects} />
    </section>
  );
}
