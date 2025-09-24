type Params = { locale: "sv" | "en" | "ja" };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const NewPostClient = (await import("./NewPostClient")).default;
  return <NewPostClient locale={locale} />;
}
