"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "@phosphor-icons/react";
import { FAQ } from "@/lib/content";
import { Section, SectionHead } from "./ui";

export default function Faq() {
  // First item open by default; opening one closes the others.
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq" h={1} attrs={{ "data-dim-orb": "" }}>
      <SectionHead
        eyebrow={FAQ.eyebrow}
        title={FAQ.h2}
        lead={FAQ.meta}
        scrim
      />
      {/* Side-by-side list (redesign skill): questions in the left
          column, the active answer in a panel on the right. On phones
          the single-column grid places the answer directly under the
          active question (inline `order`), so it reads as inline
          progressive disclosure. One panel, one id — every button
          controls it. */}
      <div
        data-ui="faq-list"
        data-reveal-stagger
        className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-12"
      >
        {FAQ.items.map((item, i) => (
          <div
            key={item.q}
            data-reveal-item
            className="hairline-t lg:col-span-5"
            style={{ order: i * 2 }}
          >
            <h3 className="display--sentence">
              <button
                type="button"
                id={`faq-button-${i}`}
                aria-expanded={open === i}
                aria-controls="faq-panel"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className={open === i ? "text-blue-light" : ""}>{item.q}</span>
                <Plus
                  size={20}
                  weight="regular"
                  aria-hidden="true"
                  className={`shrink-0 text-blue-light transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
          </div>
        ))}
        <div
          id="faq-panel"
          role="region"
          aria-labelledby={open >= 0 ? `faq-button-${open}` : undefined}
          data-reveal-item
          className="card flex flex-col justify-center p-6 lg:col-span-7 lg:col-start-6 lg:row-span-5 lg:row-start-1"
          style={{ order: open >= 0 ? open * 2 + 1 : 1 }}
        >
          {open >= 0 ? (
            <>
              <h3 className="heading-6 mb-4">{FAQ.items[open].q}</h3>
              <p className="measure text-base muted">{FAQ.items[open].a}</p>
            </>
          ) : (
            <p className="measure text-base muted">
              Choose a question to see the answer.
            </p>
          )}
        </div>
      </div>
      <div className="mt-12" data-reveal>
        <a href="#contact" className="link link--blue tap44 gap-2">
          Get your free plan
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
