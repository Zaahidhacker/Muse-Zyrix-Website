import type { ReactNode } from "react";

export function Section({
  id,
  tone = "dark",
  className = "",
  children,
}: {
  id: string;
  tone?: "dark" | "inverse" | "surface";
  className?: string;
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
      className={`section ${toneClass} ${className}`}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHead({
  title,
  lead,
}: {
  title: ReactNode;
  lead?: string;
}) {
  return (
    <div className="section-head">
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
