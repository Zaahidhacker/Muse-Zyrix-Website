import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { Btn } from "./ui";

export default function Hero() {
  const [opening, closing] = HERO.h1.split(" at ");

  return (
    <section id="top" className="hero" tabIndex={-1}>
      <div className="wrap hero__layout">
        <div className="hero__copy">
          <h1 className="display hero__title">
            {opening} <span>at {closing}</span>
          </h1>
          <p className="hero__lead">{HERO.sub}</p>
          <div className="hero__actions">
            <Btn href={HERO.secondaryHref}>
              {HERO.secondary}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Btn>
            <a href={HERO.primaryHref} className="link tap44 hero__compare">
              {HERO.primary}
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="hero__art" aria-hidden="true">
          <Image
            src="/zyrix-continuum.webp"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 780px"
            fetchPriority="high"
            className="hero__image"
          />
        </figure>
      </div>
    </section>
  );
}
