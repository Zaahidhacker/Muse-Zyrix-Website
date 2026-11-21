import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { DIFFERENCE } from "@/lib/content";
import { Section } from "./ui";

const changes = [
  ["Vague prices", "Upfront pricing"],
  ["Slow delivery", "Defined timelines"],
  ["Unclear ownership", "Your site, yours to keep"],
] as const;

export function Difference() {
  return (
    <Section id="difference">
      <div className="difference-layout">
        <div>
          <h2 className="display" data-reveal-words>{DIFFERENCE.h2}</h2>
          <p className="lead mt-6" data-reveal>{DIFFERENCE.body}</p>
        </div>
        <ul className="difference-list">
          {changes.map(([problem, outcome]) => (
            <li key={problem} data-reveal>
              <s><Minus size={18} aria-hidden="true" />{problem}</s>
              <span><Check size={18} aria-hidden="true" />{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
