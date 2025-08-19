import ProjectGrid from "@/app/components/ProjectGrid";
import { mockProjects } from "@/lib/mockProjects";
import { getTranslations } from "next-intl/server";

export default async function ProjectsIndex(props: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <ProjectGrid projects={mockProjects} />
    </section>
  );
}
