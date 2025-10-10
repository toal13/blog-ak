// components/Header.tsx
import { getTranslations } from "next-intl/server";
import HeaderClient from "./HeaderClient";

export default async function Header({
  locale,
}: {
  locale: "sv" | "en" | "ja";
}) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const translations = {
    projects: t("projects"),
    profile: t("profile"),
    contact: t("contact"),
  };

  return <HeaderClient locale={locale} translations={translations} />;
}
