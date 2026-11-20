import type { ReactNode } from "react";
import { RISK } from "@/lib/content";
import { Section } from "./ui";

function CardIcon({ index }: { index: number }): ReactNode {
  const props = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-12 w-12 text-gold",
  };
  switch (index) {
    case 0: // check-circle — Fixed before we start
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 1: // shield — You own the result
      return (
        <svg {...props}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
      );
    case 2: // bolt — Built to perform
      return (
        <svg {...props}>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 1 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 1 11 14z" />
        </svg>
      );
    default: // map-pin — Local where it matters
      return (
        <svg {...props}>
          <path d="M20 10c0 4.993-5.539 10.193-7.612 11.665a1 1 0 0 1-.776 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
  }
}

export default function Risk() {
  return (
    <Section id="risk" h={1} tone="dark" attrs={{ "data-statement": "" }}>
      {/* No eyebrow exists for this section in content.ts, so the head is
          built by hand instead of via SectionHead (which requires one). */}
      <div className="mb-12 md:mb-16">
        <h2 className="display">{RISK.h2}</h2>
        <p className="lead muted mt-5">{RISK.body}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RISK.cards.map((card, i) => (
          <article
            key={card.title}
            className="rounded-[var(--radius-md)] bg-cream p-8 text-coal"
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
