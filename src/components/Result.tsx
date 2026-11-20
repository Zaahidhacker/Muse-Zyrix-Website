"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RESULT } from "@/lib/content";
import { Section, SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * 02 / The Result — the 11-word pitch as a word-highlight moment.
 * Words start at ~45% ink opacity and turn to full ink word by word as
 * the section scrolls through the middle of the viewport; the final word
 * ("action.") is gold. Scrolling back reverses it (scrub). Under
 * prefers-reduced-motion every word is full ink with no animation.
 */
export function Result() {
  const scope = useRef<HTMLElement | null>(null);
  const words = RESULT.pitch.split(" ");

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".pitch-word", scope.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        targets,
        { opacity: 0.45 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: scope as React.RefObject<HTMLElement> },
  );

  return (
    <Section
      id="result"
      h={1}
      attrs={{ "data-statement": "" }}
    >
      <div ref={scope as React.RefObject<HTMLDivElement>} className="flex flex-1 flex-col justify-between">
        <div>
          <SectionHead
            index={RESULT.index}
            eyebrow={RESULT.eyebrow}
            title={RESULT.h2}
            lead={RESULT.body}
          />
          <p className="label muted mb-8 font-mono">{RESULT.meta}</p>
        </div>
        <p
          className="display"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
          aria-label={RESULT.pitch}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              aria-hidden="true"
              className={`pitch-word inline-block ${i === words.length - 1 ? "text-gold" : ""}`}
              style={{ opacity: 0.45, marginRight: "0.28em" }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </Section>
  );
}
