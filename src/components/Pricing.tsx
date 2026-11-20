import type { ReactNode } from "react";
import { PRICING, formatLkr } from "@/lib/content";
import { Btn, Section, SectionHead } from "./ui";

/** Market line with only its number struck through, e.g. MARKET <s>30,000</s> LKR / … */
function MarketLine({ market }: { market: string }) {
  const match = market.match(/[\d,]+\+?/);
  if (!match || match.index === undefined) return <>{market}</>;
  const i = match.index;
  return (
    <>
      {market.slice(0, i)}
      <s>{match[0]}</s>
      {market.slice(i + match[0].length)}
    </>
  );
}

function TierIcon({ n }: { n: string }): ReactNode {
  const props = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-10 w-10 text-gold",
  };
  switch (n) {
    case "01": // single page / document
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      );
    case "02": // multi-page
      return (
        <svg {...props}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case "03": // shopping cart
      return (
        <svg {...props}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    default: // layers
      return (
        <svg {...props}>
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      );
  }
}

export default function Pricing() {
  return (
    <Section id="pricing" h={2} hm={3} tone="cream">
      <SectionHead
        eyebrow={PRICING.eyebrow}
        title={PRICING.h2}
        lead={`${PRICING.meta} plans`}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {PRICING.tiers.map((tier) => (
          <article
            key={tier.n}
            className={`card card--tier flex flex-col gap-5 p-6 md:p-8${tier.n === "02" ? " card--featured" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-sm">{tier.n}</span>
              <span className="label">{tier.kind}</span>
            </div>
            <TierIcon n={tier.n} />
            <h3 className="display--sentence">{tier.name}</h3>
            <p className="figure">
              {formatLkr(tier.price)}
              {"priceSuffix" in tier ? tier.priceSuffix : ""}
              <span className="text-[0.5em]"> {tier.unit}</span>
            </p>
            <p className="label muted">{tier.period}</p>
            <p className="text-sm">
              <MarketLine market={tier.market} />
            </p>
            <ul className="flex flex-col gap-2">
              {tier.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm muted">Delivery: {tier.delivery}</p>
            <div className="mt-auto pt-2">
              <Btn href="#contact">{PRICING.footerCta}</Btn>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-start gap-4 pt-6 md:mt-12">
        <p className="label">{PRICING.footerSplit}</p>
        <Btn href={PRICING.footerCtaHref} variant="primary">
          {PRICING.footerCta}
        </Btn>
      </div>
    </Section>
  );
}
