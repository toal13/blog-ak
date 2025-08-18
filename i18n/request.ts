import { getRequestConfig } from "next-intl/server";

const LOCALES = ["sv", "en", "ja"] as const;
type Locale = (typeof LOCALES)[number];

export default getRequestConfig(async ({ locale }) => {
  const loc: Locale = LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : "sv";
  const messages = (await import(`../messages/${loc}.json`)).default;
  return { locale: loc, messages };
});
