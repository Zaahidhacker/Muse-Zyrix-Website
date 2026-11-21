import { Check } from "@phosphor-icons/react/dist/ssr";
import { PRICING, formatLkr } from "@/lib/content";
import { Btn, Section, SectionHead } from "./ui";

export default function Pricing() {
  return (
    <Section id="pricing" tone="inverse">
      <SectionHead title={PRICING.h2} />
      <div className="price-list">
        {PRICING.tiers.map((tier) => (
          <article key={tier.n} data-reveal className="price-tier">
            <div>
              <p className="label">{tier.kind}</p>
              <h3 className="heading-4 mt-2">{tier.name}</h3>
              <p className="price-tier__figure">
                {formatLkr(tier.price)}
                {"priceSuffix" in tier ? tier.priceSuffix : ""}
                <span>{tier.unit}</span>
              </p>
              <p className="muted text-sm">{tier.period}</p>
            </div>
            <ul className="price-tier__includes">
              {tier.included.map((item) => (
                <li key={item}><Check size={17} aria-hidden="true" />{item}</li>
              ))}
            </ul>
            <div className="price-tier__action">
              <p className="muted text-sm">{tier.market}</p>
              <p className="text-sm">Delivery: {tier.delivery}</p>
              <Btn href={PRICING.footerCtaHref} variant={tier.n === "02" ? "primary" : "secondary"} ariaLabel={`${PRICING.footerCta} for ${tier.name}`}>
                {PRICING.footerCta}
              </Btn>
            </div>
          </article>
        ))}
      </div>
      <p className="label mt-8">{PRICING.footerSplit}</p>
    </Section>
  );
}
