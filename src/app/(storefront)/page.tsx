import type { Metadata } from "next";
import { Suspense } from "react";
import { BirthstoneFinder } from "@/components/home/birthstone-finder";
import {
  BrandStorySection,
  GiftExperience,
  SocialSection,
  StorySection,
  ValueProposition,
} from "@/components/home/content-sections";
import { EmailSignup } from "@/components/home/email-signup";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { HomePageTracker } from "@/components/home/home-page-tracker";
import { openGraphDefaults } from "@/lib/config/images";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "VOYAGE — Meaningful Gifts. Greater Journeys.",
  description: openGraphDefaults.description,
  openGraph: {
    title: openGraphDefaults.title,
    description: openGraphDefaults.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: openGraphDefaults.image, alt: "VOYAGE birthstone jewelry" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: openGraphDefaults.title,
    description: openGraphDefaults.description,
    images: [openGraphDefaults.image],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

function FeaturedProductsFallback() {
  return (
    <section className="section-padding" aria-hidden>
      <div className="container-shell h-64 animate-pulse rounded-sm bg-brand/5" />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomePageTracker path="/" />
      <HeroSection />
      <BirthstoneFinder />
      <StorySection />
      <ValueProposition />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>
      <GiftExperience />
      <BrandStorySection />
      <EmailSignup />
      <SocialSection />
    </>
  );
}
