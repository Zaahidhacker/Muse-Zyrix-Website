import { Plus } from "@phosphor-icons/react/dist/ssr";
import { FAQ } from "@/lib/content";
import { Section, SectionHead } from "./ui";

export default function Faq() {
  return (
    <Section id="faq">
      <div className="faq-layout">
        <SectionHead title={FAQ.h2} lead={FAQ.meta} />
        <div className="faq-list">
          {FAQ.items.map(({ q, a }, index) => (
            <details name="zyrix-faq" key={q} open={index === 0}>
              <summary>
                {q}
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
