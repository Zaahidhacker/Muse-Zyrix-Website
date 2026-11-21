"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { HERO } from "@/lib/content";
import { Btn } from "./ui";

// Lazy 3D canvas: no WebGL work (or cost) until this component mounts,
// and never on the server. While the chunk loads, the CSS torus poster
// shows (Next.js streaming guidance: slow content gets a loading state).
const ContinuumOrb = dynamic(() => import("./three/ContinuumOrb"), {
  ssr: false,
  loading: () => (
    <div className="orb-fallback" aria-hidden="true">
      <div className="torus" />
    </div>
  ),
});

/**
 * Product hero: head row above (h1 left, lead + buttons right, feet
 * aligned), the dusty-blue continuum torus whole on the stage across
 * the wrap, and the small meta row at the foot. All copy comes from
 * src/lib/content.ts.
 */
export default function Hero() {
  // Two balanced lines, derived from the content string — never retyped.
  // The RevealRig splits the h1 into chars (SplitText) for the hero
  // headline stagger; the <br> is the meaningful line break (B5).
  const words = HERO.h1.split(" ");
  const firstLine = words.slice(0, 4).join(" ");
  const secondLine = words.slice(4).join(" ");

  return (
    <section
      id="top"
      className="section"
      style={{ "--h": 1 } as CSSProperties}
    >
      <div className="wrap">
        <div className="hero-text grid grid-cols-12 gap-x-6 gap-y-8">
          <div
            data-reveal-hero
            className="col-span-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
          >
            <p className="eyebrow">{HERO.eyebrow}</p>
            <p className="eyebrow">{HERO.continuum}</p>
          </div>
          <h1
            className="display scrim col-span-12 md:col-span-7"
            data-reveal-words
            data-reveal-hero
          >
            {firstLine}
            <br />
            {secondLine}
          </h1>
          <div
            data-reveal-hero
            className="scrim col-span-12 flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9"
          >
            <p className="lead">{HERO.sub}</p>
            <div className="flex flex-col items-start gap-3">
              {/* One primary action (Part A): the free plan. The scroll
                  cue is a text link, not a competing button. */}
              <Btn href={HERO.secondaryHref} variant="primary">
                {HERO.secondary}
              </Btn>
              <a href={HERO.primaryHref} className="link link--blue tap44">
                {HERO.primary}
              </a>
            </div>
          </div>

          {/* The orb's stage is a UI fragment of the hero text block
              (data-ui so the checkers read the stage as the hero's visual);
              the fixed canvas inside it travels the whole page. It never
              takes a reveal — a transform on an ancestor would re-parent
              the fixed canvas. */}
          <div className="orb-stage col-span-12" data-ui="orb-stage">
            <ContinuumOrb />
          </div>
        </div>

        <div
          data-reveal-hero
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
        >
          <span className="label muted">{HERO.scroll}</span>
          <span className="label muted">{HERO.live}</span>
          <span className="label muted">{HERO.nextSite}</span>
          <span className="label muted">{HERO.disciplines}</span>
          <span className="label muted">{HERO.flow}</span>
        </div>
      </div>
    </section>
  );
}
