import { FOOTER } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="footer" className="closing bg-navy text-mist">
      <div className="wrap py-16 md:py-24">
        <div>
          <p className="heading-4">{FOOTER.tagline}</p>
          <p
            data-reveal
            className="footer-wordmark display"
          >
            {FOOTER.wordmark}
          </p>
        </div>
        <div className="hairline-t mt-12 flex flex-col gap-6 pt-8" data-reveal>
          <p className="label">{FOOTER.studio}</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            {FOOTER.links.map((l) => (
              <a key={l.label} href={l.href} className="link label tap44">
                {l.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Legal" className="flex flex-wrap gap-6">
            <a href="/privacy" className="link tap44 text-sm">
              Privacy
            </a>
            <a href="/terms" className="link tap44 text-sm">
              Terms
            </a>
          </nav>
          <p className="muted text-sm">{FOOTER.legal}</p>
        </div>
      </div>
    </footer>
  );
}
