import staticPages from "@/lib/data/static-pages";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticPages.map((page) => ({ slug: page.slug }));
}

export default async function StaticContentPage({ params }: Props) {
  const { slug } = await params;
  const page = staticPages.find((entry) => entry.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <section className="section-padding">
      <div className="container-shell max-w-3xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">{page.title}</h1>
        <p className="mt-6 text-muted">{page.body}</p>
      </div>
    </section>
  );
}
