import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Zyrix®",
  description:
    "How Zyrix handles the details you send us through the free-plan form, WhatsApp or email.",
};

export default function Privacy() {
  return (
    <main className="wrap py-24 md:py-32">
      <p className="eyebrow mb-4">ZYRIX® — PRIVACY</p>
      <h1 className="heading-1 mb-12">Privacy</h1>
      <div className="measure flex flex-col gap-8">
        <section>
          <h2 className="heading-5 mb-2">What we collect</h2>
          <p className="body-3 muted">
            The details you send us: your name, email address, project
            choice and message from the free-plan form, and anything you
            send us by WhatsApp or email. We do not collect anything else
            from this website.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">What we use it for</h2>
          <p className="body-3 muted">
            To reply with your free plan, agree the scope of your project,
            and run the project. Nothing else.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">What we do not do</h2>
          <p className="body-3 muted">
            We do not sell your details, share them with advertisers, or
            use them for marketing you did not ask for.
          </p>
        </section>
        <section>
          <h2 className="heading-5 mb-2">Your details, your call</h2>
          <p className="body-3 muted">
            Ask us to correct or delete your details at any time — email{" "}
            <a href="mailto:zyrix.co@outlook.com" className="link link--blue">
              zyrix.co@outlook.com
            </a>{" "}
            or WhatsApp{" "}
            <a href="https://wa.me/94720551707" className="link link--blue">
              +94 72 055 1707
            </a>
            .
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
