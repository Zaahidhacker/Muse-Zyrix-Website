import type { CSSProperties, ReactNode } from "react";

/**
 * Shared section shell. One `.wrap`, h2 first, `--h` screens tall on
 * desktop (1 or 2), `--hm` on tablet/phone where the content stacks.
 * Tone "inverse" is the blue-tinted light ground (pricing, risk).
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
  tone?: "dark" | "inverse" | "surface";
  className?: string;
  attrs?: Record<string, string>;
  children: ReactNode;
}) {
  const toneClass =
    tone === "inverse"
      ? "ground-inverse"
      : tone === "surface"
        ? "ground-surface"
        : "";
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
  scrim = false,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  /** Frosted scrim behind the head (dark sections only — inverse
      sections are already opaque). */
  scrim?: boolean;
}) {
  return (
    <div className={`${scrim ? "scrim " : ""}mb-12 md:mb-16`}>
      <p className="eyebrow mb-4" data-reveal>
        {index ? `${index} / ` : ""}
        {eyebrow}
      </p>
      <h2 className="display" data-reveal-words>
        {title}
      </h2>
      {lead ? (
        <p className="lead muted mt-6" data-reveal>
          {lead}
        </p>
      ) : null}
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
