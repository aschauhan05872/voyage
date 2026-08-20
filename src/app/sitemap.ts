import type { MetadataRoute } from "next";
import { birthstones } from "@/lib/data/birthstones";
import staticPages from "@/lib/data/static-pages";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/collections/birthstones",
    "/our-story",
    ...staticPages.map((page) => `/${page.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = birthstones.map((stone) => ({
    url: `${base}/products/${stone.productSlug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
