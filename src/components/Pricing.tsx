"use client";

import type { ReactNode } from "react";
import { Copy, FileText, ShoppingCart, Stack } from "@phosphor-icons/react";
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

/** Tier icons are Phosphor (regular weight, 40px feature size). Navy on
    the light cards — blue on light grounds is only ~2.5:1. */
function TierIcon({ n }: { n: string }): ReactNode {
  const props = {
    size: 40,
    weight: "regular" as const,
    "aria-hidden": true,
    className: "text-navy",
  };
  switch (n) {
    case "01": // single page / document
      return <FileText {...props} />;
    case "02": // multi-page
      return <Copy {...props} />;
    case "03": // shopping cart
      return <ShoppingCart {...props} />;
    default: // layers
      return <Stack {...props} />;
  }
}

export default function Pricing() {
  return (
    <Section id="pricing" h={2} hm={3} tone="inverse">
      <SectionHead
        eyebrow={PRICING.eyebrow}
        title={PRICING.h2}
        lead={`${PRICING.meta} plans`}
      />
      {/* Asymmetric grid (redesign skill): 5/7 rows at xl, same internal
          structure in every card so the included lists start at the same
          Y. Business is the featured tier (the 50% benchmark): yellow
          border + a yellow tag pill straddling the top edge — emphasis
          by colour/weight, not height. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-12" data-reveal-stagger>
        {PRICING.tiers.map((tier) => (
          <article
            key={tier.n}
            data-reveal-item
            className={`card card--tier relative flex flex-col gap-6 p-6 md:p-8${tier.n === "02" ? " card--featured" : ""} ${
              tier.n === "01" || tier.n === "03" ? "xl:col-span-5" : "xl:col-span-7"
            }`}
          >
            {tier.n === "02" ? (
              <span className="caption-4 absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-navy">
                The 50% benchmark
              </span>
            ) : null}
            <div className="flex items-baseline justify-between gap-4">
              <span className="tnum text-sm">{tier.n}</span>
              <span className="label">{tier.kind}</span>
            </div>
            <TierIcon n={tier.n} />
            <h3 className="display--sentence">{tier.name}</h3>
            <p className="figure">
              {formatLkr(tier.price)}
              {"priceSuffix" in tier ? tier.priceSuffix : ""}
              <span className="text-2xl"> {tier.unit}</span>
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
      <div className="mt-10 flex flex-wrap items-center justify-start gap-4 pt-6 md:mt-12" data-reveal>
        <p className="label">{PRICING.footerSplit}</p>
        <Btn href={PRICING.footerCtaHref} variant="primary">
          {PRICING.footerCta}
        </Btn>
      </div>
    </Section>
  );
}
