"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { CONTACT, NAV } from "@/lib/content";
import { Btn } from "./ui";

export default function Nav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = ["#top", ...NAV.links.map(({ href }) => href)];
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActive(`#${current.target.id}`);
      },
      { rootMargin: "-25% 0px -70% 0px" },
    );
    for (const id of ids) {
      const section = document.querySelector(id);
      if (section) observer.observe(section);
    }
    const desktop = window.matchMedia("(min-width: 64rem)");
    const handleResize = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", handleResize);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", handleResize);
    };
  }, []);

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function dismissMenu() {
    dialogRef.current?.close();
  }

  return (
    <>
      <header className="nav">
        <a className="skip-link" href="#top">Skip to content</a>
        <div className="wrap">
          <a href="#top" className="nav__wordmark" aria-label="Zyrix, back to top">
            <span className="mark-arc" aria-hidden="true">Z</span>
            <span>ZYRIX®</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            {NAV.links.map(({ href, label }) => (
              <a key={href} href={href} aria-current={active === href ? "location" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <a className="nav__price" href={NAV.ctaHref}>
            {NAV.cta}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={openMenu}
          >
            <List size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) dismissMenu();
        }}
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className="mobile-menu__body">
          <button type="button" className="nav__toggle mobile-menu__close" aria-label="Close menu" onClick={dismissMenu}>
            <X size={24} aria-hidden="true" />
          </button>
          <nav aria-label="Mobile" className="mobile-menu__links">
            {NAV.links.map(({ href, label }) => (
              <a href={href} key={href} onClick={dismissMenu}>{label}</a>
            ))}
          </nav>
          <Btn href={NAV.ctaHref} onClick={dismissMenu}>{NAV.cta}</Btn>
          <div className="mobile-menu__contact">
            <a href={CONTACT.whatsappUrl} className="link tap44">{CONTACT.whatsappDisplay}</a>
            <a href={CONTACT.emailUrl} className="link tap44">{CONTACT.emailDisplay}</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
