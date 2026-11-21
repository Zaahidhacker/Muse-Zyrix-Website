"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, NAV } from "@/lib/content";
import { Btn } from "./ui";

export default function Nav() {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Live scroll progress: scrollY / (docHeight - innerHeight), rAF-throttled.
  useEffect(() => {
    let raf = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        max > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)))
          : 0,
      );
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-spy: the nav link for the section centred in the viewport
  // is the current item (B9). A thin middle band so exactly one section
  // is current at a time.
  useEffect(() => {
    const ids = NAV.links.map((l) => l.href.replace(/^#/, ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: focus moves to the first link, Escape closes and focus
  // returns to the toggle, scroll locks while open.
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const close = useCallback(() => {
    setOpen(false);
    // If focus was inside the menu (a link just clicked, or Escape),
    // return it to the toggle so it never sits on a hidden element.
    if (document.activeElement?.closest("#mobile-menu")) {
      toggleRef.current?.focus();
    }
  }, []);

  return (
    <>
      <header className="nav" data-menu-open={open}>
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <div className="wrap">
          <div className="hidden flex-1 xl:flex">
            <nav className="nav__links" aria-label="Primary">
              {NAV.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-active={active === l.href || undefined}
                  aria-current={active === l.href ? "true" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <a
            href="#top"
            className="nav__wordmark flex items-center gap-2"
            aria-label="Zyrix — back to top"
          >
            <span className="mark-arc" aria-hidden="true">
              Z
            </span>
            <span>ZYRIX®</span>
          </a>

          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="hidden lg:block">
              <span className="progress-pill">
                <span className="dot" aria-hidden="true" />
                <span>{progress}%</span>
              </span>
            </span>
            <span className="hidden sm:block">
              <Btn href={NAV.ctaHref}>{NAV.cta}</Btn>
            </span>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="menu-toggle__line menu-toggle__line--top" aria-hidden="true" />
              <span className="menu-toggle__line menu-toggle__line--mid" aria-hidden="true" />
              <span className="menu-toggle__line menu-toggle__line--bottom" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in panel: always mounted so it can slide in from the
          right; hidden off-canvas with visibility + inert while closed.
          The nav pill stays above it (z 70) so the morphing toggle is
          the close control — no close button inside the panel. */}
      <div
        className={`menu-backdrop${open ? " menu-backdrop--open" : ""}`}
        aria-hidden="true"
        onClick={close}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`menu-panel${open ? " menu-panel--open" : ""}`}
      >
        <nav
          className="flex flex-1 flex-col justify-center gap-2"
          aria-label="Mobile"
        >
          {NAV.links.map((l, i) => (
            <a
              key={l.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={l.href}
              onClick={close}
              className="menu-link display py-3 text-4xl"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-6">
            <Btn href={NAV.ctaHref} onClick={close}>
              {NAV.cta}
            </Btn>
          </div>
          <div className="hairline-t mt-8 flex flex-col gap-4 pt-6">
            <p>
              <span className="label muted mr-3">WHATSAPP</span>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="link"
              >
                {CONTACT.whatsappDisplay}
              </a>
            </p>
            <p>
              <span className="label muted mr-3">EMAIL</span>
              <a href={CONTACT.emailUrl} onClick={close} className="link">
                {CONTACT.emailDisplay}
              </a>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
