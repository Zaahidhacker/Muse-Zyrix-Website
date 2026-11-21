"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RevealRig() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("main [data-reveal-words], main [data-reveal]").forEach((target) => {
        ScrollTrigger.create({
          trigger: target,
          start: "top 92%",
          once: true,
          onEnter: () => {
            if (target.getBoundingClientRect().top < 0) return;
            gsap.from(target, {
              y: 15,
              duration: 0.56,
              ease: "power3.out",
              clearProps: "transform",
            });
          },
        });
      });
    });
    return () => media.revert();
  }, []);

  return null;
}
