import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms — Zyrix®",
  description:
    "How Zyrix projects work: price, payment, scope, ownership and support.",
};

export default function Terms() {
  return (
    <main className="wrap py-24 md:py-32">
      <p className="eyebrow mb-4">ZYRIX® — TERMS</p>
      <h1 className="heading-1 mb-12">Terms</h1>
      <div className="measure flex flex-col gap-8">
        <section>
          <h2 className="heading-5 mb-2">Price and payment</h2>
          <p className="body-3 muted">
            Prices are one-time, as listed on this site. 50% confirms the
            project and starts design. The remaining 50% is due after
            approval, before final launch and handover. Domain, hosting or
            paid third-party tools are shown separately at cost.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">Scope</h2>
          <p className="body-3 muted">
            Before work starts, you receive a clear list of pages,
            features, timeline and total. That list is the agreed scope;
            anything beyond it is scoped separately.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">Ownership</h2>
          <p className="body-3 muted">
            Your design, content and production code are handed over to
            you.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">After launch</h2>
          <p className="body-3 muted">
            Every project includes handover and a defined support period.
            Commerce includes priority support; custom systems include 30
            days. Ongoing help is optional, never forced.
          </p>
        </section>
        <p>
          <Link href="/" className="link link--blue tap44 gap-2">
            Back to Zyrix
          </Link>
        </p>
      </div>
    </main>
  );
}
