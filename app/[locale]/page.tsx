// app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

export default async function Page(props: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <main className="p-6 space-y-2">
      <div>locale: {locale}</div>
      <nav className="flex gap-6">
        <a>{t("projects")}</a>
        <a>{t("profile")}</a>
        <a>{t("contact")}</a>
      </nav>
    </main>
  );
}
