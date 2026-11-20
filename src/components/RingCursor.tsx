"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Thin gold ring cursor, Unseen-style: a 36px ring that trails the
 * pointer with a soft lag and grows slightly over links and buttons.
 * Desktop pointer:fine devices only; never on touch, never under
 * prefers-reduced-motion. The native cursor stays visible — the ring
 * is an accent halo, not a replacement, so form fields keep their
 * I-beam and nothing about usability changes.
 */
export default function RingCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.25, ease: "power3" });
    let shown = false;

    const onMove = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.25 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      scaleTo(target?.closest?.("a, button, [role='button'], input, select, textarea") ? 1.7 : 1);
    };
    const onLeave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="ring-cursor" aria-hidden="true" />;
}
