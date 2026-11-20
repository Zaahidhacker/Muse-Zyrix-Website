"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, NAV } from "@/lib/content";
import { Btn } from "./ui";

export default function Nav() {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  // Mobile menu: focus moves in, Escape closes, scroll locks while open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
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

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="nav">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <div className="wrap">
          <div className="hidden flex-1 xl:flex">
            <nav className="nav__links" aria-label="Primary">
              {NAV.links.map((l) => (
                <a key={l.href} href={l.href}>
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
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <span className="flex flex-col gap-1.5" aria-hidden="true">
                <span className="block h-0.5 w-5 bg-cream" />
                <span className="block h-0.5 w-5 bg-cream" />
                <span className="block h-0.5 w-5 bg-cream" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in panel (Unseen-style): always mounted so it can slide
          in from the right; hidden off-canvas with visibility + inert
          while closed. The backdrop is a flat dim — no blur, per the
          brief's small-scrims-only rule. */}
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
        <div className="flex h-[var(--nav)] items-center justify-between px-6">
          <span className="nav__wordmark flex items-center gap-2">
            <span className="mark-arc" aria-hidden="true">
              Z
            </span>
            <span>ZYRIX®</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-2xl leading-none"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav
          className="flex flex-1 flex-col justify-center gap-2 px-6"
          aria-label="Mobile"
        >
          {NAV.links.map((l) => (
            <a
              key={l.href}
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
