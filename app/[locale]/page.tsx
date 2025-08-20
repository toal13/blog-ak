import { mockProjects } from "@/lib/mockProjects";
import FeaturedCard from "../components/FeaturedCard";

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  // featured 指定があるものを代表作に
  const featured = mockProjects.find((p) => p.featured);

  // featured 以外から新しい4件
  const latestFour = mockProjects
    .filter((p) => !p.featured)
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 4);

  return (
    <div className="space-y-16">
      {/* 代表作 */}
      {featured && (
        <section>
          <FeaturedCard project={featured} />
        </section>
      )}

      {/* 最新4件 */}
      <section className="px-4 md:px-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestFour.map((p) => (
            <FeaturedCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
