"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scrollState, setScrollProgress } from "@/lib/scroll-state";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Smooth-scroll rig: Lenis driven by GSAP's ticker, kept in sync with
 * ScrollTrigger, and publishing page progress / velocity to scroll-state
 * for the orb. Anchor links scroll through Lenis instead of jumping.
 * Under prefers-reduced-motion Lenis is skipped entirely (native scroll)
 * and scrollState.reducedMotion is set for the orb. Renders nothing.
 */
export default function ScrollRig() {
  useGSAP(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scrollState.reducedMotion = reduced;

    const updateNativeProgress = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        max > 0 ? window.scrollY / max : 0,
        0,
      );
    };

    if (reduced) {
      updateNativeProgress();
      window.addEventListener("scroll", updateNativeProgress, {
        passive: true,
      });
      return () => {
        window.removeEventListener("scroll", updateNativeProgress);
      };
    }

    const lenis = new Lenis();

    const onLenisScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        max > 0 ? instance.scroll / max : 0,
        instance.velocity,
      );
    };
    lenis.on("scroll", onLenisScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };
    document.addEventListener("click", onClick);

    updateNativeProgress();
    void document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      // No ScrollTriggers are created here, so there is nothing to kill.
    };
  }, []);

  return null;
}
