import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <Header locale={locale} />
      <main lang={locale} className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
