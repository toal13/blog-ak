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
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* 左：プロフィール写真 */}
        <div className="relative w-full aspect-[3/4] overflow-hidden shadow-xl">
          <Image
            src="/profile.JPG"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* 右：プロフィールテキスト */}
        <div className="space-y-6">
          <header>
            {/* <h1 className="text-4xl font-bold mb-2">{t("title")}</h1> */}
            <p className="text-xl text-gray-600">{t("role")}</p>
          </header>

          <p className="text-lg font-medium">{t("intro")}</p>

          <div className="space-y-4">
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
