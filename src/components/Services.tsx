"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "@phosphor-icons/react";
import { SERVICES, formatLkr } from "@/lib/content";
import { Section, SectionHead } from "./ui";

/* ---------- 01 · Brand + Web: identity lockup cycler ---------- */

function BrandMock({ item }: { item: (typeof SERVICES.items)[0] }) {
  const lockups = item.visual.lines.slice(2);
  const [i, setI] = useState(0);
  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="brand-lockup">
      <p className="label muted">{item.visual.kind}</p>
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-light text-2xl font-bold text-blue-light">
        {item.visual.lines[0]}
      </span>
      <p className="label">{item.visual.lines[1]}</p>
      <p className="heading-5">
        {lockups[i]}
      </p>
      <button
        type="button"
        className="btn btn--secondary mt-auto self-start"
        onClick={() => setI((v) => (v + 1) % lockups.length)}
      >
        Change lockup
      </button>
    </div>
  );
}

/* ---------- 02 · E-commerce: mini shop ---------- */

const SHOP_PRICE = 75000;

function ShopMock({ item }: { item: (typeof SERVICES.items)[1] }) {
  const [qty, setQty] = useState(1);
  const total = SHOP_PRICE * qty;
  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="mini-cart">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label muted">{item.visual.kind}</p>
        <p className="label text-blue-light">CART ({qty})</p>
      </div>
      <p className="text-lg font-medium">Sculpted light</p>
      <p className="muted tnum text-sm">LKR {formatLkr(SHOP_PRICE)}</p>
      {/* Polite live region (ux-guidelines.csv #118): quantity changes
          announce a contextual status, without moving focus. */}
      <p className="visually-hidden" role="status" aria-atomic="true">
        {qty} item{qty === 1 ? "" : "s"} in cart, LKR {formatLkr(total)}
      </p>
      <div className="flex items-center gap-4">
        <span className="label muted">QTY</span>
        <div className="flex items-center gap-1 rounded-md border border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)]">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-lg"
            onClick={() => setQty((q) => Math.max(0, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center tnum">{String(qty).padStart(2, "0")}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-lg"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>
      <p className="flex items-baseline justify-between border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] pt-4">
        <span className="label muted">Total</span>
        <span className="text-xl font-semibold">LKR {formatLkr(total)}</span>
      </p>
      <button type="button" className="btn btn--primary mt-auto w-full">
        {qty > 0 ? `CHECKOUT → LKR ${formatLkr(total)}` : "CHECKOUT →"}
      </button>
    </div>
  );
}

/* ---------- 03 · Digital Systems: live ops dashboard ---------- */

function OpsMock({ item }: { item: (typeof SERVICES.items)[2] }) {
  const [orders, setOrders] = useState(128);
  const [revenue, setRevenue] = useState(84);
  const [bookings, setBookings] = useState(36);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOrders((v) => v + Math.floor(Math.random() * 3));
      setRevenue((v) => v + Math.floor(Math.random() * 2));
      setBookings((v) => v + Math.floor(Math.random() * 2));
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const stats = [
    { label: "ORDERS", value: String(orders) },
    { label: "REVENUE", value: `${revenue}K` },
    { label: "BOOKINGS", value: String(bookings) },
  ];

  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="ops-dashboard">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label muted">{item.visual.kind}</p>
        <p className="label flex items-center gap-2 text-blue-light">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-blue" aria-hidden="true" />
          LIVE
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-md border border-[color-mix(in_srgb,var(--p-ink)_10%,transparent)] px-3 py-3"
          >
            <p className="tnum text-xl font-semibold md:text-2xl">{s.value}</p>
            <p className="label muted mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <div>
        <p className="label muted mb-2">ACTIVITY</p>
        {stats.map((s) => (
          <p
            key={s.label}
            className="flex items-baseline justify-between border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] py-2 text-sm"
          >
            <span>{s.label}</span>
            <span className="label text-blue-light">
              STATUS · LIVE
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------- 04 · Motion: pointer disc + GSAP loop ---------- */

const DISC = 28;

function MotionMock({ item }: { item: (typeof SERVICES.items)[3] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const xToRef = useRef<((x: number) => void) | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (discRef.current) {
      xToRef.current = gsap.quickTo(discRef.current, "x", { duration: 0.4, ease: "expo.out" });
    }
    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (playing || !trackRef.current || !xToRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const max = Math.max(0, rect.width - DISC);
    const x = Math.min(max, Math.max(0, e.clientX - rect.left - DISC / 2));
    xToRef.current(x);
  };

  const togglePlay = () => {
    if (playing) {
      tweenRef.current?.kill();
      tweenRef.current = null;
      if (discRef.current) gsap.set(discRef.current, { x: 0, scale: 1, opacity: 1 });
      setPlaying(false);
      return;
    }
    if (!discRef.current || !trackRef.current) return;
    tweenRef.current = gsap.to(discRef.current, {
      x: () => Math.max(0, (trackRef.current?.clientWidth ?? DISC) - DISC),
      scale: 1.5,
      opacity: 0.55,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    setPlaying(true);
  };

  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="motion-demo">
      <p className="label muted">{item.visual.kind}</p>
      <div className="flex gap-4">
        {item.visual.lines.map((word) => (
          <span key={word} className="display text-xl">
            {word}
          </span>
        ))}
      </div>
      <div
        ref={trackRef}
        onPointerMove={onPointerMove}
        className="relative h-24 touch-none rounded-md border border-[color-mix(in_srgb,var(--p-ink)_10%,transparent)]"
        role="presentation"
      >
        <div
          className="absolute top-1/2 h-px w-full bg-[color-mix(in_srgb,var(--p-ink)_20%,transparent)]"
          aria-hidden="true"
        />
        <div
          ref={discRef}
          className="absolute top-1/2 -mt-3.5 h-7 w-7 rounded-full bg-blue"
          style={{ left: 0 }}
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        className="btn btn--secondary mt-auto self-start"
        onClick={togglePlay}
        aria-pressed={playing}
      >
        {playing ? "Stop" : "Play"}
      </button>
    </div>
  );
}

/* ---------- Section ---------- */

/** Claim in the display face, last word in blue (emphasis via colour,
    not italics — B1). */
function ClaimText({ claim }: { claim: string }) {
  const words = claim.split(" ");
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <>
      {rest ? `${rest} ` : ""}
      <span className="text-blue-light">{last}</span>
    </>
  );
}

export function Services() {
  const [brand, shop, ops, motion] = SERVICES.items;
  const mocks = [
    <BrandMock key="brand" item={brand} />,
    <ShopMock key="shop" item={shop} />,
    <OpsMock key="ops" item={ops} />,
    <MotionMock key="motion" item={motion} />,
  ];

  return (
    <Section id="services" h={2} hm={3} attrs={{ "data-dim-orb": "" }}>
      <SectionHead index={SERVICES.index} eyebrow={SERVICES.eyebrow} title={SERVICES.h2} scrim />
      {/* Asymmetric grid (redesign skill): 5/7/7/5 at xl, the wide cards
          carry the horizontal mocks; the right column staggers down 48px.
          Below xl the two-column grid with stacked cards. */}
      <div
        className="grid flex-1 grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-12"
        data-reveal-stagger
      >
        {SERVICES.items.map((item, i) => {
          const head = (
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <span className="label muted">{item.n}</span>
              <span className="label">{item.title}</span>
            </div>
          );
          const claim = (
            <h3 className="display--sentence mb-2">
              <ClaimText claim={item.claim} />
            </h3>
          );
          const body = <p className="muted mb-6 max-w-prose">{item.body}</p>;
          const tags = (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="caption-4 rounded-full border border-[color-mix(in_srgb,var(--p-ink)_20%,transparent)] px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          );

          // Cards 2 and 3 (Make buying easy / Make work simple): horizontal
          // on xl — text left, mock right — in the wide 7-col spans.
          if (i === 1 || i === 2) {
            return (
              <article
                key={item.n}
                data-reveal-item
                className={`card card--lift flex flex-col gap-6 p-6 xl:col-span-7 xl:flex-row${i === 1 ? " xl:mt-12" : ""}`}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  {head}
                  {claim}
                  {body}
                  {tags}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">{mocks[i]}</div>
              </article>
            );
          }

          // Card 4 (Be remembered): mock at the bottom, below the text
          // and tags — a low stack, distinct from the top and side mocks.
          if (i === 3) {
            return (
              <article key={item.n} data-reveal-item className="card card--lift flex flex-col p-6 xl:col-span-5 xl:mt-12">
                {head}
                {claim}
                {body}
                {tags}
                <div className="mt-6 flex flex-1 flex-col">{mocks[i]}</div>
              </article>
            );
          }

          // Card 1 (Be trusted): mock above the text.
          if (i === 0) {
            return (
              <article key={item.n} data-reveal-item className="card card--lift flex flex-col p-6 xl:col-span-5">
                {head}
                <div className="mb-6 flex flex-col">{mocks[i]}</div>
                {claim}
                {body}
                {tags}
              </article>
            );
          }

          return (
            <article key={item.n} data-reveal-item className="card card--lift flex flex-col p-6 xl:col-span-5">
              {head}
              {claim}
              {body}
              {mocks[i]}
              {tags}
            </article>
          );
        })}
      </div>
      <div className="mt-12" data-reveal>
        <a href="#contact" className="link link--blue tap44 gap-2">
          Get your free plan
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
