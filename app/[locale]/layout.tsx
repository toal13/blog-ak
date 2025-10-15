import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Toaster } from "sonner";
import { AdminSessionGuard } from "../components/AdminSessionGuard";

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
      <AdminSessionGuard /> {/* 追加 */}
      <Header locale={locale} />
      <main lang={locale} className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">
        {children}
      </main>
      <Toaster position="bottom-right" richColors />
      <Footer />
    </NextIntlClientProvider>
  );
}
