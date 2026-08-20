import Image from "next/image";
import { imageConfig } from "@/lib/config/images";

export function HeroImage() {
  return (
    <div className="absolute inset-0">
      <picture>
        <source media="(max-width: 767px)" srcSet={imageConfig.hero.mobile} />
        <Image
          src={imageConfig.hero.desktop}
          alt={imageConfig.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </picture>
      <div
        className="absolute inset-0 bg-gradient-to-t from-[rgba(16,42,36,0.82)] via-[rgba(16,42,36,0.45)] to-[rgba(16,42,36,0.25)]"
        aria-hidden
      />
    </div>
  );
}
