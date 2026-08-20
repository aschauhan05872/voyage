import {
  BirthstoneFinder,
} from "@/components/home/birthstone-finder";
import {
  BrandStorySection,
  EmailCaptureSection,
  GiftExperience,
  ReviewsSection,
  SocialContentSection,
  StorySection,
  ValueProposition,
} from "@/components/home/content-sections";
import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BirthstoneFinder />
      <StorySection />
      <ValueProposition />
      <GiftExperience />
      <BrandStorySection />
      <ReviewsSection />
      <SocialContentSection />
      <EmailCaptureSection />
    </>
  );
}
