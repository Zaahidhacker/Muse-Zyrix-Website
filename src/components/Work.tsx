"use client";

import { useMemo, useState } from "react";
import { CONTACT, PRICING, WORK, formatLkr } from "@/lib/content";
import { Section, SectionHead } from "./ui";

/* ---------- 01 · Koti's restaurant ordering ---------- */

function RestaurantMock({ item }: { item: (typeof WORK.items)[0] }) {
  const m = item.mock;
  const [added, setAdded] = useState<Record<string, number>>({});

  const totalItems = Object.values(added).reduce((a, b) => a + b, 0);
  const total = m.menu.reduce((sum, dish) => sum + dish.price * (added[dish.name] ?? 0), 0);
  const orderNo = 128 + totalItems;
  const counts = m.counts.map((c) => (c.label === "NEW" ? { ...c, value: c.value + totalItems } : c));

  const orderText =
    totalItems > 0
      ? `Hello Koti's! I'd like to order: ${m.menu
          .filter((dish) => added[dish.name])
          .map((dish) => `${added[dish.name]} × ${dish.name}`)
          .join(", ")} — Total LKR ${formatLkr(total)}.`
      : "Hello Koti's! I'd like to place an order.";
  const orderHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(orderText)}`;

  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="restaurant-ordering">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label muted">{m.kitchen}</p>
        <p className="label text-gold">{m.ordersLive}</p>
      </div>
      <div>
        <p className="display text-3xl">{m.name}</p>
        <p className="label muted mt-1">{m.sub}</p>
      </div>
      <div>
        {m.menu.map((dish) => (
          <div
            key={dish.name}
            className="flex items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] py-3"
          >
            <span className="text-sm">
              {dish.name}
              {(added[dish.name] ?? 0) > 0 && (
                <span className="ml-2 font-mono text-xs text-gold">×{added[dish.name]}</span>
              )}
            </span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-sm">LKR {formatLkr(dish.price)}</span>
              <button
                type="button"
                className="flex min-h-11 items-center rounded-md border border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)] px-4 py-1.5 font-mono text-xs tracking-[0.08em] transition-colors hover:border-gold hover:text-gold"
                onClick={() => setAdded((prev) => ({ ...prev, [dish.name]: (prev[dish.name] ?? 0) + 1 }))}
              >
                ADD
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] pt-4">
        <span className="font-mono text-sm text-gold">#{orderNo}</span>
        {counts.map((c) => (
          <span key={c.label} className="label muted">
            {c.label} {c.value}
          </span>
        ))}
      </div>
      {totalItems > 0 && (
        <p className="flex items-baseline justify-between text-sm">
          <span className="label muted">Total</span>
          <span className="font-display text-xl font-semibold">LKR {formatLkr(total)}</span>
        </p>
      )}
      <a
        className="btn btn--primary mt-auto w-full"
        href={orderHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {m.orderNow}
      </a>
    </div>
  );
}

/* ---------- 02 · FORM objects e-commerce ---------- */

function FormMock({ item }: { item: (typeof WORK.items)[1] }) {
  const m = item.mock;
  const [cart, setCart] = useState(1);
  const total = cart * m.price;
  const nav = useMemo(
    () => m.nav.map((n) => (n.startsWith("CART") ? `CART (${cart})` : n)),
    [m.nav, cart],
  );

  return (
    <div className="panel flex flex-1 flex-col gap-4" data-ui="objects-shop">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label">{m.brand}</p>
        <p className="flex gap-4">
          {nav.map((n) => (
            <span key={n} className="label muted" style={{ fontSize: "11px" }}>
              {n}
            </span>
          ))}
        </p>
      </div>
      <p className="label muted">{m.objectNo}</p>
      <p className="label">{m.category}</p>
      <p className="display text-3xl">{m.name}</p>
      <p className="serif-accent text-2xl">{m.line}</p>
      <p className="font-display text-xl font-semibold">LKR {formatLkr(m.price)}</p>
      <button
        type="button"
        className="btn btn--primary mt-auto w-full"
        onClick={() => setCart((c) => c + 1)}
      >
        {m.addToCart}
      </button>
      <p className="flex items-baseline justify-between text-sm">
        <span className="label muted">Cart total</span>
        <span className="font-display text-lg font-semibold">LKR {formatLkr(total)}</span>
      </p>
    </div>
  );
}

/* ---------- 03 · Corporate ---------- */

function CorporateMock({ item }: { item: (typeof WORK.items)[2] }) {
  const m = item.mock;
  const [open, setOpen] = useState(false);
  return (
    <div className="panel flex flex-1 flex-col gap-5" data-ui="corporate-preview">
      <p className="label muted">{m.label}</p>
      <p className="display text-3xl">{m.line}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn btn--secondary self-start"
      >
        {m.cta}
      </button>
      {open && (
        <div className="rounded-md border border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] p-5">
          <p className="display text-2xl">{m.line}</p>
          <a className="link link--gold mt-3 inline-block font-medium" href="#contact">
            {PRICING.footerCta}
          </a>
        </div>
      )}
    </div>
  );
}

/* ---------- Section ---------- */

/** Claim in the display face, last word in italic serif. */
function ClaimText({ claim }: { claim: string }) {
  const words = claim.split(" ");
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <>
      {rest ? `${rest} ` : ""}
      <em className="serif-accent">{last}</em>
    </>
  );
}

export function Work() {
  return (
    <Section id="work" h={2} hm={3}>
      <SectionHead eyebrow={WORK.eyebrow} title={WORK.h2} lead={WORK.meta} />
      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-3">
        {WORK.items.map((item) => (
          <article key={item.n} className="card card--lift flex flex-col p-6 md:p-7">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <span className="label muted">{item.n}</span>
              <span className="label">{item.title}</span>
            </div>
            <h3 className="display--sentence mb-2">
              <ClaimText claim={item.claim} />
            </h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color-mix(in_srgb,var(--p-ink)_20%,transparent)] px-3 py-1 font-mono text-[11px] tracking-[0.12em]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {item.n === "01" && <RestaurantMock item={WORK.items[0]} />}
            {item.n === "02" && <FormMock item={WORK.items[1]} />}
            {item.n === "03" && <CorporateMock item={WORK.items[2]} />}
          </article>
        ))}
      </div>
    </Section>
  );
}
