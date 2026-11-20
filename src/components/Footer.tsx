import { CONTACT_SECTION, FOOTER } from "@/lib/content";
import { Btn } from "./ui";

export default function Footer() {
  return (
    <footer id="footer" className="closing bg-coal text-cream">
      <div className="wrap py-16 md:py-24">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <p className="display text-[clamp(36px,5vw,72px)]">
              {FOOTER.tagline}
            </p>
            <Btn href="#contact">{CONTACT_SECTION.form.submit}</Btn>
          </div>
          <p
            aria-label="Zyrix"
            className="display mt-16 leading-[0.85] text-[clamp(72px,22vw,320px)]"
          >
            {FOOTER.wordmark}
          </p>
        </div>
        <div className="hairline-t mt-12 flex flex-col gap-6 pt-8">
          <p className="label">{FOOTER.studio}</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            {FOOTER.links.map((l) => (
              <a key={l.label} href={l.href} className="link label tap44">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="muted text-sm">{FOOTER.legal}</p>
        </div>
      </div>
    </footer>
  );
}
