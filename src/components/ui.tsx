import type { CSSProperties, ReactNode } from "react";

/**
 * Shared section shell. One `.wrap`, h2 first, `--h` screens tall on
 * desktop (1 or 2), `--hm` on tablet/phone where the content stacks.
 * Tone "cream" is the inverse ground (pricing, risk — as the live site does).
 */
export function Section({
  id,
  h = 1,
  hm,
  tone = "dark",
  className = "",
  attrs,
  children,
}: {
  id: string;
  h?: 1 | 2;
  hm?: 1 | 2 | 3;
  tone?: "dark" | "cream" | "surface";
  className?: string;
  attrs?: Record<string, string>;
  children: ReactNode;
}) {
  const toneClass =
    tone === "cream" ? "ground-inverse" : tone === "surface" ? "ground-surface" : "";
  return (
    <section
      id={id}
      {...attrs}
      className={`section ${toneClass} ${className}`}
      style={{ "--h": h, "--hm": hm } as CSSProperties}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lead,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="eyebrow mb-4">
        {index ? `${index} / ` : ""}
        {eyebrow}
      </p>
      <h2 className="display">{title}</h2>
      {lead ? <p className="lead muted mt-5">{lead}</p> : null}
    </div>
  );
}

export function Btn({
  href,
  variant = "primary",
  children,
  onClick,
  ariaLabel,
}: {
  href?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href ?? "#top"}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn btn--${variant}`}
    >
      {children}
    </a>
  );
}
