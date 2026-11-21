"use client";

import { useEffect, useRef, useState } from "react";
import { PROMISE, formatLkr } from "@/lib/content";
import { Btn, Section } from "./ui";

/** rAF count-up with cubic ease-out. Calls `done` when it lands. */
function countUp(
  target: number,
  durationMs: number,
  set: (n: number) => void,
  done?: () => void,
) {
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / durationMs);
    set(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
    else done?.();
  };
  requestAnimationFrame(tick);
}

/**
 * B11 tagline reveal — the tagline as its own moment. Words start at
 * ~30% ink and transition individually to full colour in reading order
 * (120ms apart) on the base curve, once, when the heading enters the
 * viewport. Reduced motion shows the final text immediately. The
 * accessible name is the full tagline; the animated words are hidden
 * from the accessibility tree.
 */
function TaglineReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred one tick: setState directly in an effect body is
      // flagged by react-hooks/set-state-in-effect.
      const t = window.setTimeout(() => setActive(true), 0);
      return () => window.clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Two lines at the sentence boundary: "Same standard." / "Half the rate."
  const [first, second] = text.split(". ");
  const lines = [first ? `${first}.` : "", second ?? ""].filter(Boolean);
  let i = -1;
  return (
    <h2 ref={ref} className="heading-1" aria-label={text}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((word) => {
            i += 1;
            const idx = i;
            return (
              <span
                key={idx}
                className={`tagline-word${active ? " tagline-word--on" : ""}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {word}{" "}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

/**
 * The 50% Promise — market price counts up on enter, then a "÷2" beat,
 * then the Zyrix price in huge yellow display type (the 50% moments are
 * the accent). Comparison table below, split terms + "See every plan"
 * link at the foot.
 */
export function Promise() {
  const [market, setMarket] = useState(0);
  const [zyrix, setZyrix] = useState(0);
  const [showDivide, setShowDivide] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setMarket(PROMISE.marketPrice);
          setZyrix(PROMISE.zyrixPrice);
          setShowDivide(true);
          return;
        }
        countUp(PROMISE.marketPrice, 1400, setMarket, () => {
          setShowDivide(true);
          window.setTimeout(() => countUp(PROMISE.zyrixPrice, 1200, setZyrix), 350);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section id="promise" h={2} attrs={{ "data-dim-orb": "" }}>
      <div className="scrim mb-12 md:mb-16">
        <p className="eyebrow mb-4" data-reveal>
          {PROMISE.eyebrow}
        </p>
        <TaglineReveal text={PROMISE.h2} />
        <p className="lead muted mt-6" data-reveal>
          {PROMISE.note}
        </p>
      </div>
      <div ref={wrapRef} className="flex flex-1 flex-col justify-between gap-10 md:gap-12">
        {/* Counter: the "60,000 → ÷2 → 30,000" stack stays vertical on the
            left; the Zyrix lines sit beside it on md+, so the block spans
            the container width instead of leaving side space. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center" data-reveal>
          <div>
            <p className="label muted">{PROMISE.marketLabel}</p>
            <p className="figure mt-2">
              {formatLkr(market)} LKR
            </p>
            <p
              className="figure mt-4 text-accent transition-opacity duration-300"
              style={{ opacity: showDivide ? 1 : 0 }}
              aria-hidden={!showDivide}
            >
              ÷2
            </p>
            <p className="figure mt-4 text-accent">
              {formatLkr(zyrix)} LKR
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-pretty">{PROMISE.zyrixLine}</p>
            <p className="muted mt-1">{PROMISE.zyrixIncludes}</p>
          </div>
        </div>

        {/* Comparison table */}
        <div data-ui="comparison-table" data-reveal-stagger>
          {PROMISE.rows.map((row, i) => (
            <div
              key={row.name}
              data-reveal-item
              className={`flex items-baseline justify-between gap-6 py-6 ${i > 0 ? "hairline-t" : ""}`}
            >
              <span className="label">{row.name}</span>
              <span className="flex items-baseline gap-4 md:gap-8">
                <span className="heading-3 text-accent">
                  {row.zyrix}
                </span>
                <s className="muted tnum text-sm">{row.market}</s>
              </span>
            </div>
          ))}
          <div className="hairline-t" />
        </div>

        {/* Footer row */}
        <div className="flex flex-wrap items-center justify-start gap-4" data-reveal>
          <p className="label">{PROMISE.split}</p>
          <Btn href={PROMISE.seePlansHref}>{PROMISE.seePlans}</Btn>
        </div>
      </div>
    </Section>
  );
}
