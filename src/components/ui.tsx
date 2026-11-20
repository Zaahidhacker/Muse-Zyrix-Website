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

/**
 * Two-voice headlines, Unseen-style: the last word of a string title
 * sits in thin italic serif against the condensed display face.
 * ReactNode titles pass through unchanged. Styling only — no copy
 * changes, so the accessible name is untouched.
 */
function accentTitle(title: ReactNode): ReactNode {
  if (typeof title !== "string") return title;
  const words = title.split(" ");
  if (words.length < 2) {
    return <em className="serif-accent">{title}</em>;
  }
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <>
      {rest}{" "}
      <em className="serif-accent">{last}</em>
    </>
  );
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
  /** Frosted scrim behind the head (dark sections only — cream
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
        {accentTitle(title)}
      </h2>
      {lead ? (
        <p className="lead muted mt-5" data-reveal>
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
