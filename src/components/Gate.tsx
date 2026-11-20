"use client";

import { useEffect, useRef, useState } from "react";
import { markGateDone } from "@/lib/gate-state";

const LETTERS = ["Z", "Y", "R", "I", "X"];

/**
 * Intro gate: a black curtain with the ZYRIX wordmark staggering in from
 * blur and a thin gold line drawing across, then the whole gate lifts
 * away to reveal the hero. Total under ~1.4s on first visit; returning
 * visitors (sessionStorage) get a shortened 350ms lift. Click anywhere
 * to skip. Fully disabled under prefers-reduced-motion (content shows
 * immediately, gate-done fires at once). Scroll is locked while the
 * gate is up so the hero can't be peeked early.
 */
export default function Gate() {
  const [phase, setPhase] = useState<"in" | "lifting">("in");
  const [render, setRender] = useState(true);
  const [fast, setFast] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markGateDone();
      // Deferred one tick: setState directly in an effect body is
      // flagged by react-hooks/set-state-in-effect.
      const t = window.setTimeout(() => setRender(false), 0);
      return () => window.clearTimeout(t);
    }
    const seen = window.sessionStorage.getItem("zyrix-gate-seen") === "1";
    // One tick late so the class lands after first paint (and so no
    // setState runs directly in the effect body).
    timers.current.push(window.setTimeout(() => setFast(seen), 0));
    const liftDelay = seen ? 350 : 950;
    document.body.style.overflow = "hidden";

    const lift = () => {
      setPhase("lifting");
      markGateDone();
      window.sessionStorage.setItem("zyrix-gate-seen", "1");
      document.body.style.overflow = "";
    };
    timers.current.push(window.setTimeout(lift, liftDelay));
    timers.current.push(window.setTimeout(() => setRender(false), liftDelay + 750));
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      document.body.style.overflow = "";
    };
  }, []);

  const skip = () => {
    if (phase === "lifting") return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase("lifting");
    markGateDone();
    window.sessionStorage.setItem("zyrix-gate-seen", "1");
    document.body.style.overflow = "";
    timers.current.push(window.setTimeout(() => setRender(false), 750));
  };

  if (!render) return null;

  return (
    <div
      data-gate
      role="presentation"
      aria-hidden="true"
      onClick={skip}
      className={`gate${phase === "lifting" ? " gate--lifting" : ""}${fast ? " gate--fast" : ""}`}
    >
      <p className="gate__wordmark display" aria-hidden="true">
        {LETTERS.map((letter, i) => (
          <span
            key={letter}
            className="gate__letter"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {letter}
          </span>
        ))}
      </p>
      <span className="gate__line" aria-hidden="true" />
      <p className="gate__label">INDEPENDENT DIGITAL STUDIO</p>
    </div>
  );
}
