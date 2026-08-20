"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

const socialLinks = [
  { key: "instagram" as const, label: "Instagram" },
  { key: "tiktok" as const, label: "TikTok" },
  { key: "pinterest" as const, label: "Pinterest" },
];

export function SocialSection() {
  const availableLinks = socialLinks.filter((link) => siteConfig.social[link.key]);

  return (
    <section className="section-padding border-t border-line" aria-labelledby="social-heading">
      <div className="container-shell max-w-3xl text-center">
        <h2 id="social-heading" className="display-font text-3xl text-brand md:text-4xl">
          Follow the Journey
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Discover Voyage through stories, gifting moments and new collections.
        </p>

        {availableLinks.length > 0 ? (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {availableLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={siteConfig.social[link.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-11 px-6 text-xs uppercase tracking-[0.14em]"
                  onClick={() =>
                    trackEvent("social_click", {
                      platform: link.key,
                    })
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-xs text-muted">
            Social links will appear here once configured.
          </p>
        )}
      </div>
    </section>
  );
}

function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--champagne-gold)]" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2 3 9l9 13 9-13-9-7Zm0 3.2 5.8 4.5L12 18.8 6.2 9.7 12 5.2Z"
      />
    </svg>
  );
}

function SilverIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--champagne-gold)]" aria-hidden>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path fill="currentColor" d="M12 6v12M8 8.5h8M8 15.5h8" opacity="0.7" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--champagne-gold)]" aria-hidden>
      <path
        fill="currentColor"
        d="M4 10h16v10H4V10Zm2-4h5a2 2 0 1 1 0 4H6V6Zm7 0v4h5a2 2 0 1 0 0-4h-5Z"
      />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--champagne-gold)]" aria-hidden>
      <path
        fill="currentColor"
        d="M6 4h9a3 3 0 0 1 3 3v13l-3-2-3 2-3-2-3 2V7a3 3 0 0 1 3-3Z"
      />
    </svg>
  );
}

const values = [
  {
    title: "Natural Gemstones",
    body: "Thoughtfully selected gemstone jewelry.",
    Icon: GemIcon,
  },
  {
    title: "925 Sterling Silver",
    body: "Made with 925 sterling silver where specified by the product.",
    Icon: SilverIcon,
  },
  {
    title: "Gift Ready",
    body: "Presented as a meaningful gift.",
    Icon: GiftIcon,
  },
  {
    title: "Thoughtful Design",
    body: "Jewelry designed around personal stories and meaningful moments.",
    Icon: StoryIcon,
  },
];

export function ValueProposition() {
  return (
    <section className="section-padding bg-white/40" aria-label="Why VOYAGE">
      <div className="container-shell">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, body, Icon }) => (
            <article key={title} className="card-surface p-6">
              <Icon />
              <h3 className="display-font mt-4 text-2xl text-brand">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="section-padding" aria-labelledby="story-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden rounded-sm md:min-h-[360px]">
          <Image
            src="/placeholders/story-editorial.svg"
            alt="VOYAGE birthstone jewelry styled as a meaningful gift"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 id="story-heading" className="display-font text-4xl text-brand md:text-5xl">
            More Than a Necklace
          </h2>
          <div className="mt-6 space-y-3 text-base leading-relaxed text-muted">
            <p>Some gifts are beautiful.</p>
            <p>The best ones mean something.</p>
            <p>
              Your birth month.
              <br />
              Your gemstone.
              <br />
              Your story.
            </p>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            VOYAGE combines natural gemstone jewelry with personal meaning and gifting — so
            each piece can represent a month, a memory, or someone you love. Gemstones are
            traditionally associated with their birth months and often symbolized as tokens of
            celebration and connection.
          </p>
        </div>
      </div>
    </section>
  );
}

export function GiftExperience() {
  return (
    <section className="section-padding bg-brand text-[var(--warm-ivory)]" aria-labelledby="gift-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden rounded-sm border border-white/10 md:min-h-[360px]">
          <Image
            src="/placeholders/packaging-gift-set.svg"
            alt="VOYAGE gift packaging with branded box, jewelry pouch, and story card"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 id="gift-heading" className="display-font text-4xl md:text-5xl">
            A Little Gift. A Greater Journey.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--warm-taupe)] md:text-base">
            From the jewelry to the final presentation, every Voyage piece is designed to make
            the moment feel meaningful.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-[var(--warm-taupe)]">
            <li>VOYAGE box</li>
            <li>Jewelry pouch</li>
            <li>Story card</li>
            <li>Birthstone pendant necklace</li>
          </ul>
          <Link href="/collections/birthstones" className="btn-primary mt-8 inline-flex">
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section className="section-padding" aria-labelledby="brand-story-heading">
      <div className="container-shell max-w-3xl text-center">
        <h2 id="brand-story-heading" className="display-font text-4xl text-brand md:text-5xl">
          Every Journey Deserves Something Meaningful.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted">
          VOYAGE believes meaningful gifts can represent personal journeys, milestones,
          relationships, memories, and new beginnings. Each birthstone piece is designed to
          feel premium, personal, and ready to mark the moments that matter.
        </p>
        <Link href="/our-story" className="btn-primary mt-8 inline-flex">
          Our Story
        </Link>
      </div>
    </section>
  );
}
