"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";
import { Section, SectionHead } from "./ui";

export default function Faq() {
  // First item open by default; opening one closes the others.
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq" h={1}>
      <SectionHead
        eyebrow={FAQ.eyebrow}
        title={FAQ.h2}
        lead={FAQ.meta}
      />
      <div data-ui="faq-accordion">
        {FAQ.items.map((item, i) => (
          <div key={item.q} className="hairline-t">
            <h3 className="display--sentence">
              <button
                type="button"
                id={`faq-button-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span>{item.q}</span>
                <span aria-hidden="true" className="font-mono text-xl text-gold">
                  {open === i ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === i ? (
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className="pb-6"
              >
                <p className="measure text-base muted">{item.a}</p>
              </div>
            ) : null}
          </div>
        ))}
        <div className="hairline-t" />
      </div>
    </Section>
  );
}
