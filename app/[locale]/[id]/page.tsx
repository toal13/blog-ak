import { mockProjects } from "@/lib/mockProjects";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage(props: {
  params: Promise<{ locale: "sv" | "en" | "ja"; id: string }>;
}) {
  const { id } = await props.params;

  const project = mockProjects.find((p) => p.id === id);
  if (!project) return notFound();

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-600">
          {project.location} · {project.year}
        </p>
      </div>

      <p className="text-lg text-gray-700">{project.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {project.images.map((src: string, i: number) => (
          <Image
            key={i}
            src={src}
            alt={`${project.title} image ${i + 1}`}
            width={800}
            height={600}
            className="rounded-lg object-cover"
          />
        ))}
      </div>
    </main>
  );
}
