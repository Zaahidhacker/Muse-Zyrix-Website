"use client";

import type { ReactNode } from "react";
import { CheckCircle, Lightning, MapPin, ShieldCheck } from "@phosphor-icons/react";
import { RISK } from "@/lib/content";
import { Section } from "./ui";

/** Risk icons are Phosphor (regular weight, 40px feature size). Navy on
    the light cards — blue on light grounds is only ~2.5:1. */
function CardIcon({ index }: { index: number }): ReactNode {
  const props = {
    size: 40,
    weight: "regular" as const,
    "aria-hidden": true,
    className: "text-navy",
  };
  switch (index) {
    case 0: // check-circle — Fixed before we start
      return <CheckCircle {...props} />;
    case 1: // shield — You own the result
      return <ShieldCheck {...props} />;
    case 2: // bolt — Built to perform
      return <Lightning {...props} />;
    default: // map-pin — Local where it matters
      return <MapPin {...props} />;
  }
}

export default function Risk() {
  // "website." is the live site's own emphasis word — blue, not italics.
  const [headStart] = RISK.h2.split("website.");
  return (
    <Section id="risk" h={1} tone="dark" attrs={{ "data-statement": "" }}>
      {/* No eyebrow exists for this section in content.ts, so the head is
          built by hand instead of via SectionHead (which requires one). */}
      <div className="mb-12 md:mb-16">
        <h2 className="display" data-reveal-words>
          {headStart}
          <span className="text-blue-light">website.</span>
        </h2>
        <p className="lead muted mt-6" data-reveal>
          {RISK.body}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-reveal-stagger>
        {RISK.cards.map((card, i) => (
          <article
            key={card.title}
            data-reveal-item
            className="rounded-md bg-mist p-8 text-navy"
          >
            <CardIcon index={i} />
            <h3 className="display--sentence mt-4">{card.title}</h3>
            <p className="mt-3 text-base">{card.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
