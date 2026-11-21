"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import "./GlareHover.css";

// Adapted from React Bits GlareHover (DavidHDev/react-bits). See LICENSE.md.
export default function GlareHover({ children }: { children: ReactNode }) {
  const bandRef = useRef<HTMLSpanElement>(null);

  function sweep(event: PointerEvent<HTMLDivElement>) {
    const band = bandRef.current;
    if (
      !band ||
      event.pointerType === "touch" ||
      !window.matchMedia("(any-hover: hover) and (prefers-reduced-motion: no-preference)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const diagonal = Math.hypot(bounds.width, bounds.height);
    const bandWidth = diagonal * 0.29;
    const angle = -32;
    const radians = (angle * Math.PI) / 180;
    const axisX = Math.sin(radians);
    const axisY = -Math.cos(radians);
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;
    const direction = offsetX * axisX + offsetY * axisY > 0 ? -1 : 1;
    const reach =
      (Math.abs(bounds.width * axisX) + Math.abs(bounds.height * axisY) + bandWidth) / 2 + 2;

    band.getAnimations().forEach((animation) => animation.cancel());
    band.style.width = `${bandWidth}px`;
    band.style.height = `${diagonal + bandWidth}px`;

    const transform = (x: number) =>
      `translate(-50%, -50%) rotate(${angle - 90}deg) translateX(${x}px)`;

    band.animate(
      [
        { transform: transform(-direction * reach), opacity: 1 },
        { transform: transform(direction * reach), opacity: 1 },
      ],
      { duration: 900, easing: "ease-in-out" },
    );
  }

  return (
    <div className="glare-hover" onPointerEnter={sweep}>
      {children}
      <span ref={bandRef} className="glare-hover__band" aria-hidden="true" />
    </div>
  );
}
