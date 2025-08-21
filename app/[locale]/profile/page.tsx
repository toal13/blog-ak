import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: "sv" | "en" | "ja" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });

  const bio: string[] = t.raw("bio");

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* 左：プロフィール写真 */}
        <div className="relative w-full aspect-square overflow-hidden shadow border border-gray-200">
          <Image
            src="/sample.jpg"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* 右：プロフィールテキスト */}
        <div className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-gray-600">{t("role")}</p>
          </header>

          <p className="text-lg">{t("intro")}</p>

          <div className="space-y-3">
            {bio.map((p, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
