import Link from "next/link";
import { FooterEmailSignup } from "@/components/home/email-signup";
import { siteConfig } from "@/lib/config/site";

const shopLinks = [
  { href: "/collections/birthstones", label: "Birthstone Collection" },
  { href: "/collections/birthstones?featured=true", label: "Featured Pieces" },
];

const helpLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/order-status", label: "Order Status" },
  { href: "/jewelry-care", label: "Jewelry Care" },
];

const aboutLinks = [
  { href: "/our-story", label: "Our Story" },
  { href: "/our-story#promise", label: "Our Promise" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-brand text-[var(--warm-ivory)]">
      <div className="container-shell section-padding grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="display-font text-3xl tracking-[0.18em]">VOYAGE</p>
          <p className="mt-3 max-w-sm text-sm text-[var(--warm-taupe)]">
            {siteConfig.tagline}
          </p>
          <FooterEmailSignup />
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />
        <FooterColumn title="About" links={aboutLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-4 py-6 text-xs text-[var(--warm-taupe)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[var(--warm-ivory)]">
                {link.label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} VOYAGE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--champagne-gold)]">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-[var(--warm-ivory)]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
