"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RESULT } from "@/lib/content";
import { Section, SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const pitchWords = RESULT.pitch.split(" ");

export function Result() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".pitch-word", { opacity: 0.67 }, {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.5,
        },
      });
    }, scope.current ?? undefined);
    return () => media.revert();
  }, { scope });

  return (
    <Section id="result" tone="surface">
      <div ref={scope} className="result-layout">
        <SectionHead title={RESULT.h2} lead={RESULT.body} />
        <p className="result-pitch">
          <span className="visually-hidden">{RESULT.pitch}</span>
          <span aria-hidden="true">
            {pitchWords.map((word, index) => (
              <span
                key={word}
                className={`pitch-word inline-block${index === pitchWords.length - 1 ? " text-blue-light" : ""}`}
              >
                {word}
              </span>
            ))}
          </span>
        </p>
      </div>
    </Section>
  );
}
