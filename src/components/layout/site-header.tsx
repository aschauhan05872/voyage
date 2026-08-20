"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CartHeaderLink } from "@/components/cart/cart-header-link";

const primaryNavLinks = [
  { href: "/collections/birthstones", label: "Birthstones" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    const menuButton = menuButtonRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="display-font text-2xl tracking-[0.18em] text-brand">
          VOYAGE
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm uppercase tracking-[0.12em] md:flex"
          aria-label="Primary"
        >
          {primaryNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.12em] md:gap-4">
          <CartHeaderLink />
          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-nav"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span
              className={`block h-px w-5 bg-brand transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`block h-px w-5 bg-brand ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px w-5 bg-brand transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[70] md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(16,42,36,0.4)]"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav
            id="mobile-primary-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--warm-ivory)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="display-font text-xl tracking-[0.14em] text-brand">Menu</p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center text-brand hover:text-accent"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8 py-10">
              {primaryNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="display-font block py-3 text-3xl text-brand hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-8 py-6 text-xs uppercase tracking-[0.18em] text-muted">
              Meaningful Gifts. Greater Journeys.
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
