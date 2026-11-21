"use client";

import { useEffect, useRef, useState } from "react";
import { JOURNEY } from "@/lib/content";
import { Section, SectionHead } from "./ui";

/* ---------- Step mocks (copy only from JOURNEY.steps[i].visual) ---------- */

function DiscoverMock({ step }: { step: (typeof JOURNEY.steps)[0] }) {
  const v = step.visual;
  const labels = v.labels.split(" + ");
  return (
    <div className="panel flex flex-1 flex-col gap-6" data-ui="journey-mock">
      <p className="rounded-md border border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)] px-4 py-3 text-sm">
        {v.search}
      </p>
      <div className="flex flex-col gap-2">
        {labels.map((label) => (
          <p
            key={label}
            className="flex items-center justify-between border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] py-3 text-sm"
          >
            <span>{v.line}</span>
            <span className="label muted">
              {label}
            </span>
          </p>
        ))}
      </div>
      <p className="heading-5">{v.line}</p>
      <p className="muted">{v.sub}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {v.tags.map((tag) => (
          <span
            key={tag}
            className="caption-4 rounded-full border border-[color-mix(in_srgb,var(--p-ink)_20%,transparent)] px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrustMock({ step }: { step: (typeof JOURNEY.steps)[1] }) {
  const v = step.visual;
  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="journey-mock">
      <p className="label muted">{v.label}</p>
      <p className="figure text-blue-light">
        {v.score}
      </p>
      <p className="flex flex-wrap gap-x-5 gap-y-1">
        {v.words.map((word) => (
          <span key={word} className="heading-5">
            {word}
          </span>
        ))}
      </p>
      <p className="mt-auto text-lg">{v.line}</p>
    </div>
  );
}

function MessageMock({ step }: { step: (typeof JOURNEY.steps)[2] }) {
  const v = step.visual;
  const [messages, setMessages] = useState<{ from: "in" | "out"; text: string }[]>([
    { from: "in", text: v.incoming },
    { from: "out", text: v.outgoing },
  ]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "out", text }]);
    setDraft("");
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="journey-mock">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-medium">{v.business}</p>
        <p className="label text-blue-light">
          {v.response}
        </p>
      </div>
      <div ref={listRef} className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
              m.from === "in"
                ? "self-start bg-[color-mix(in_srgb,var(--p-ink)_10%,transparent)]"
                : "self-end bg-blue text-navy"
            }`}
          >
            {m.text}
          </p>
        ))}
      </div>
      <form
        className="mt-auto flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={v.placeholder}
          aria-label={v.placeholder}
          className="h-12 min-w-0 flex-1 rounded-md border border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)] bg-transparent px-3 text-sm outline-none placeholder:text-muted focus:border-blue-light"
        />
        <button type="submit" className="btn btn--primary shrink-0">
          Send
        </button>
      </form>
    </div>
  );
}

function PayMock({ step }: { step: (typeof JOURNEY.steps)[3] }) {
  const v = step.visual;
  const [selected, setSelected] = useState(0);
  return (
    <div className="panel flex flex-1 flex-col gap-6" data-ui="journey-mock">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label muted">{v.label}</p>
        <p className="heading-5 text-blue-light">{v.currency}</p>
      </div>
      <p className="heading-5">{v.line}</p>
      <div className="grid grid-cols-2 gap-3" role="group" aria-label={v.line}>
        {v.methods.map((method, i) => (
          <button
            key={method}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className={`flex h-14 items-center justify-center rounded-md border px-3 tnum text-sm tracking-[0.08em] transition-colors duration-300 ${
              selected === i
                ? "border-blue-light bg-blue text-navy"
                : "border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)]"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
      <p className="mt-auto text-sm">
        <span className="label muted">Current method — </span>
        <span className="font-medium text-blue-light">{v.methods[selected]}</span>
      </p>
    </div>
  );
}

/* ---------- Section ---------- */

export function Journey() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const step = JOURNEY.steps[active];

  const selectStep = (i: number) => {
    if (i === active) return;
    setActive(i);
    setVisible(false);
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setVisible(true)),
    );
  };

  return (
    <Section id="journey" h={2} hm={1} attrs={{ "data-dim-orb": "" }}>
      <SectionHead eyebrow={JOURNEY.eyebrow} title={JOURNEY.h2} lead={JOURNEY.stats} scrim />
      <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Step buttons */}
        <div className="flex flex-col gap-2" role="group" aria-label={JOURNEY.h2} data-reveal-stagger>
          {JOURNEY.steps.map((s, i) => (
            <button
              key={s.n}
              type="button"
              data-reveal-item
              aria-pressed={active === i}
              onClick={() => selectStep(i)}
              className={`rounded-md border p-6 text-left transition-colors duration-300 ${
                active === i
                  ? "border-blue-light bg-panel"
                  : "border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)]"
              }`}
            >
              <span className="flex items-baseline gap-4">
                <span className="label muted">{s.n}</span>
                <span className="heading-6">{s.title}</span>
                <span className="text-xl font-medium text-blue-light">{s.claim}</span>
              </span>
              <span className="muted mt-2 block text-sm">{s.body}</span>
            </button>
          ))}
        </div>

        {/* Active step mock */}
        <div
          className="flex flex-col"
          data-reveal
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition:
              "opacity 300ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* 40px under the step header: at 390px the mock panel sat
              16px (mb-4) under this row, reading as glued to it. The
              grid's own 40px gap already separates the stacked columns. */}
          <div className="mb-10 flex items-baseline gap-4">
            <span className="label muted">{step.n}</span>
            <h3 className="heading-5">{step.title}</h3>
            <span className="heading-5 text-blue-light">{step.claim}</span>
          </div>
          {active === 0 && <DiscoverMock step={JOURNEY.steps[0]} />}
          {active === 1 && <TrustMock step={JOURNEY.steps[1]} />}
          {active === 2 && <MessageMock step={JOURNEY.steps[2]} />}
          {active === 3 && <PayMock step={JOURNEY.steps[3]} />}
        </div>
      </div>
    </Section>
  );
}
