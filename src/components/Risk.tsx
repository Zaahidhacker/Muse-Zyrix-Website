import { CheckCircle, Lightning, MapPin, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { RISK } from "@/lib/content";
import { Section } from "./ui";

const riskIcons = [CheckCircle, ShieldCheck, Lightning, MapPin] as const;

export default function Risk() {
  // "website." is the live site's own emphasis word — blue, not italics.
  const [headStart] = RISK.h2.split("website.");
  return (
    <Section id="risk" tone="dark">
      <div className="mb-12 md:mb-16">
        <h2 className="display" data-reveal-words>
          {headStart}
          <span className="text-blue-light">website.</span>
        </h2>
        <p className="lead muted mt-6" data-reveal>
          {RISK.body}
        </p>
      </div>
      <div className="grid gap-x-12 md:grid-cols-2">
        {RISK.cards.map((card, index) => {
          const Icon = riskIcons[index];
          return (
            <article key={card.title} className="hairline-t py-6" data-reveal>
              <Icon size={26} className="text-blue-light" aria-hidden="true" />
              <h3 className="display--sentence mt-3">{card.title}</h3>
              <p className="muted mt-2 text-base">{card.body}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
