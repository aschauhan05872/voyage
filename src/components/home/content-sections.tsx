import Link from "next/link";

const values = [
  { title: "Natural Gemstones", body: "Each pendant features a genuine birthstone, selected for its month and meaning." },
  { title: "925 Sterling Silver", body: "Crafted in sterling silver for everyday wear with a refined, lasting finish." },
  { title: "Gift Ready", body: "Arrives in VOYAGE packaging with a story card — ready to give from the moment it arrives." },
  { title: "Meaningful Design", body: "Designed to celebrate birth months, milestones, and the people who matter most." },
];

export function ValueProposition() {
  return (
    <section className="section-padding bg-white/40">
      <div className="container-shell">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <article key={item.title} className="card-surface p-6">
              <h3 className="display-font text-2xl text-brand">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="section-padding">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div className="min-h-[320px] rounded-sm bg-brand/90" aria-hidden />
        <div>
          <h2 className="display-font text-4xl text-brand md:text-5xl">More Than a Necklace</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            <p>Some gifts are beautiful.</p>
            <p>The best ones mean something.</p>
            <p>Your birth month.<br />Your gemstone.<br />Your story.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GiftExperience() {
  return (
    <section className="section-padding bg-brand text-[var(--warm-ivory)]">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="display-font text-4xl md:text-5xl">A Little Gift. A Greater Journey.</h2>
          <ul className="mt-6 space-y-2 text-sm text-[var(--warm-taupe)]">
            <li>Branded VOYAGE box</li>
            <li>Jewelry pouch</li>
            <li>Story card</li>
            <li>Birthstone pendant necklace</li>
          </ul>
        </div>
        <div className="min-h-[280px] rounded-sm border border-white/10 bg-[#0a1f1a]" aria-label="Packaging preview placeholder" />
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section className="section-padding">
      <div className="container-shell max-w-3xl text-center">
        <h2 className="display-font text-4xl text-brand md:text-5xl">
          Every Journey Deserves Something Meaningful.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted">
          VOYAGE was created for the moments that matter — birthdays, milestones, and quiet
          reminders of love. We craft birthstone jewelry that feels personal, premium, and
          ready to become part of someone&apos;s story.
        </p>
        <Link href="/our-story" className="btn-primary mt-8 inline-flex">
          Discover VOYAGE
        </Link>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="section-padding border-y border-line bg-white/30">
      <div className="container-shell text-center">
        <h2 className="display-font text-3xl text-brand">Customer Stories</h2>
        <p className="mt-4 text-sm text-muted">Customer stories coming soon.</p>
      </div>
    </section>
  );
}

export function SocialContentSection() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <h2 className="display-font text-3xl text-brand">From the Voyage</h2>
        <p className="mt-2 text-sm text-muted">Curated brand moments — Instagram & TikTok integration in a later phase.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-sm bg-brand/10" aria-hidden />
          ))}
        </div>
      </div>
    </section>
  );
}

export function EmailCaptureSection() {
  return (
    <section className="section-padding bg-brand text-[var(--warm-ivory)]">
      <div className="container-shell max-w-2xl text-center">
        <h2 className="display-font text-4xl">Join the Voyage</h2>
        <p className="mt-3 text-sm text-[var(--warm-taupe)]">
          Be the first to discover new stories, gifts and collections.
        </p>
        <p className="mt-1 text-xs text-[var(--champagne-gold)]">10% off your first order.</p>
        <p className="mt-6 text-xs text-[var(--warm-taupe)]">Email capture form — Phase 10.</p>
      </div>
    </section>
  );
}
