import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export async function generateStaticParams() {
  return [{ locale: "sv" }, { locale: "en" }, { locale: "ja" }];
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { children } = props;
  const { locale } = await props.params;

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
