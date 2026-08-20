function ContentPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-padding">
      <div className="container-shell max-w-3xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">{title}</h1>
        <div className="prose-voyage mt-8 space-y-4 text-base leading-relaxed text-muted">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function OurStoryPage() {
  return (
    <ContentPage title="Our Story">
      <p>
        VOYAGE began with a simple belief: the most treasured gifts carry meaning beyond
        their beauty. Each birthstone pendant is designed to honor a month, a memory, or
        someone worth celebrating.
      </p>
      <p id="promise">
        Our promise is premium materials, thoughtful presentation, and honest storytelling —
        never exaggerated claims, always genuine care.
      </p>
    </ContentPage>
  );
}
