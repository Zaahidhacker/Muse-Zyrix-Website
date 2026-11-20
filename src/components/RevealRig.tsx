"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gateState } from "@/lib/gate-state";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal rig — one place that owns every scroll entrance on the page.
 *
 * - `[data-reveal-words]` headings: split into word masks (`.rv` /
 *   `.rv-i`, see globals.css) that rise from blur + 110% offset,
 *   staggered ~50ms a word, once, on entering the viewport.
 * - `[data-reveal]` blocks: fade + 24px rise, once.
 * - `[data-reveal-stagger]` containers: their `[data-reveal-item]`
 *   children rise as one staggered batch.
 * - `[data-reveal-hero]` + the hero heading: paused until the intro
 *   gate lifts (`zyrix:gate-done`, or immediately if the gate already
 *   fired / was skipped).
 * - `[data-dim-orb]` sections: while one is centred in the viewport,
 *   `html[data-orb-dim="1"]` dims and shrinks the gold orb behind the
 *   text (CSS transition on `.orb-canvas`), so copy never fights it.
 *
 * prefers-reduced-motion: nothing is created — every element stays
 * exactly as rendered. Gentle mode (`html[data-motion="lite"]`): simple
 * opacity fades, no blur, no rise. Splitting preserves the text nodes
 * and spaces, so accessible names and line-wrapping are unchanged.
 * Renders nothing.
 */

function isReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLite(): boolean {
  return document.documentElement.dataset.motion === "lite";
}

/**
 * Split an element's words into mask/inner span pairs. Text nodes are
 * split on whitespace (spaces kept as real text nodes, so wrapping and
 * the accessible name are unchanged); element children (e.g. an
 * italic-serif accent <em>) are wrapped whole and animated as one
 * unit. <br> is left alone. Returns the inner spans to animate.
 */
function splitIntoWords(el: HTMLElement): HTMLElement[] {
  const inners: HTMLElement[] = [];
  const nodes = Array.from(el.childNodes);
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text) continue;
      const frag = document.createDocumentFragment();
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const mask = document.createElement("span");
          mask.className = "rv";
          const inner = document.createElement("span");
          inner.className = "rv-i";
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
          inners.push(inner);
        }
      }
      el.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as HTMLElement;
      if (child.tagName === "BR") continue;
      const mask = document.createElement("span");
      mask.className = "rv";
      child.classList.add("rv-i");
      child.parentNode?.insertBefore(mask, child);
      mask.appendChild(child);
      inners.push(child);
    }
  }
  return inners;
}

export default function RevealRig() {
  useEffect(() => {
    if (isReduced()) return;
    const lite = isLite();
    let playHero: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // --- Word-split headings (scroll sections) ---
      gsap.utils
        .toArray<HTMLElement>("[data-reveal-words]:not([data-reveal-hero])")
        .forEach((el) => {
          const inners = splitIntoWords(el);
          if (!inners.length) return;
          if (lite) {
            gsap.set(inners, { opacity: 0 });
            gsap.to(inners, {
              opacity: 1,
              duration: 0.45,
              stagger: 0.04,
              ease: "power1.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          } else {
            gsap.set(inners, { yPercent: 110, opacity: 0, filter: "blur(8px)" });
            gsap.to(inners, {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          }
        });

      // --- Plain blocks ---
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (lite) {
          gsap.from(el, {
            opacity: 0,
            duration: 0.45,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        } else {
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        }
      });

      // --- Staggered batches (card grids, table rows, FAQ items) ---
      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((container) => {
        const items = container.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (!items.length) return;
        if (lite) {
          gsap.from(items, {
            opacity: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power1.out",
            scrollTrigger: { trigger: container, start: "top 88%", once: true },
          });
        } else {
          gsap.from(items, {
            y: 24,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: container, start: "top 88%", once: true },
          });
        }
      });

      // --- Orb veil: dim the canvas while a text-heavy section is centred ---
      const active = new Set<HTMLElement>();
      gsap.utils.toArray<HTMLElement>("[data-dim-orb]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          end: "bottom 35%",
          onToggle: (self) => {
            if (self.isActive) active.add(section);
            else active.delete(section);
            document.documentElement.dataset.orbDim = active.size > 0 ? "1" : "0";
          },
        });
      });

      // --- Hero: paused until the gate lifts ---
      const heroHeading = document.querySelector<HTMLElement>(
        "[data-reveal-words][data-reveal-hero]",
      );
      const heroBlocks = gsap.utils.toArray<HTMLElement>("[data-reveal-hero]:not([data-reveal-words])");
      const heroTweens: gsap.core.Tween[] = [];

      if (heroHeading) {
        const inners = splitIntoWords(heroHeading);
        if (inners.length) {
          if (lite) {
            gsap.set(inners, { opacity: 0 });
            heroTweens.push(
              gsap.to(inners, {
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "power1.out",
                paused: true,
              }),
            );
          } else {
            gsap.set(inners, { yPercent: 110, opacity: 0, filter: "blur(8px)" });
            heroTweens.push(
              gsap.to(inners, {
                yPercent: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.055,
                paused: true,
              }),
            );
          }
        }
      }
      heroBlocks.forEach((el, i) => {
        if (lite) {
          gsap.set(el, { opacity: 0 });
          heroTweens.push(
            gsap.to(el, { opacity: 1, duration: 0.5, delay: 0.15 + i * 0.08, paused: true }),
          );
        } else {
          gsap.set(el, { y: 24, opacity: 0 });
          heroTweens.push(
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.15 + i * 0.09,
              ease: "power3.out",
              paused: true,
            }),
          );
        }
      });

      const playHeroFn = () => {
        heroTweens.forEach((t) => t.play());
      };
      playHero = playHeroFn;
      if (gateState.done) {
        playHeroFn();
      } else {
        window.addEventListener("zyrix:gate-done", playHeroFn, { once: true });
      }
    }, document.body);

    return () => {
      if (playHero) window.removeEventListener("zyrix:gate-done", playHero);
      ctx.revert();
      document.documentElement.dataset.orbDim = "0";
    };
  }, []);

  return null;
}
