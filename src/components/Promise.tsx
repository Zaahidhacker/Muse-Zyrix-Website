"use client";

import { useEffect, useRef, useState } from "react";
import { PROMISE, formatLkr } from "@/lib/content";
import { Btn, Section, SectionHead } from "./ui";

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
 * The 50% Promise — market price counts up on enter, then a "÷2" beat,
 * then the Zyrix price in huge gold display type. Comparison table below,
 * split terms + "See every plan" link at the foot.
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
      <SectionHead eyebrow={PROMISE.eyebrow} title={PROMISE.h2} lead={PROMISE.note} scrim />
      <div ref={wrapRef} className="flex flex-1 flex-col justify-between gap-10 md:gap-14">
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
              className="figure mt-4 text-gold transition-opacity duration-300"
              style={{ opacity: showDivide ? 1 : 0 }}
              aria-hidden={!showDivide}
            >
              ÷2
            </p>
            <p className="figure mt-4 text-gold">
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
              className={`flex items-baseline justify-between gap-6 py-5 ${i > 0 ? "hairline-t" : ""}`}
            >
              <span className="label">{row.name}</span>
              <span className="flex items-baseline gap-4 md:gap-8">
                <span className="display text-gold" style={{ fontSize: "clamp(24px, 2.6vw, 36px)" }}>
                  {row.zyrix}
                </span>
                <s className="muted font-mono text-sm">{row.market}</s>
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
