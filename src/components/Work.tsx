"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
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
        <p className="label text-blue-light">{m.ordersLive}</p>
      </div>
      <div>
        <p className="heading-4">{m.name}</p>
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
                <span className="ml-2 tnum text-xs text-blue-light">×{added[dish.name]}</span>
              )}
            </span>
            <span className="flex items-center gap-3">
              <span className="tnum text-sm">LKR {formatLkr(dish.price)}</span>
              <button
                type="button"
                className="flex min-h-11 items-center rounded-md border border-[color-mix(in_srgb,var(--p-ink)_25%,transparent)] px-4 py-2 tnum text-xs tracking-[0.08em] transition-colors duration-300 hover:border-blue-light hover:text-blue-light"
                onClick={() => setAdded((prev) => ({ ...prev, [dish.name]: (prev[dish.name] ?? 0) + 1 }))}
              >
                ADD
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] pt-4">
        <span className="tnum text-sm text-blue-light">#{orderNo}</span>
        {counts.map((c) => (
          <span key={c.label} className="label muted tnum">
            {c.label} {c.value}
          </span>
        ))}
      </div>
      {totalItems > 0 && (
        <p className="flex items-baseline justify-between text-sm">
          <span className="label muted">Total</span>
          <span className="text-xl font-semibold">LKR {formatLkr(total)}</span>
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
            <span key={n} className="label muted">
              {n}
            </span>
          ))}
        </p>
      </div>
      <p className="label muted">{m.objectNo}</p>
      <p className="label">{m.category}</p>
      <p className="heading-4">{m.name}</p>
      <p className="text-2xl font-medium text-blue-light">{m.line}</p>
      <p className="tnum text-xl font-semibold">LKR {formatLkr(m.price)}</p>
      <button
        type="button"
        className="btn btn--primary mt-auto w-full"
        onClick={() => setCart((c) => c + 1)}
      >
        {m.addToCart}
      </button>
      {/* Polite live region (ux-guidelines.csv #118): cart changes
          announce a contextual status, without moving focus. */}
      <p className="visually-hidden" role="status" aria-atomic="true">
        {cart} item{cart === 1 ? "" : "s"} in cart, LKR {formatLkr(total)}
      </p>
      <p className="flex items-baseline justify-between text-sm">
        <span className="label muted">Cart total</span>
        <span className="tnum text-lg font-semibold">LKR {formatLkr(total)}</span>
      </p>
    </div>
  );
}

/* ---------- 03 · Corporate ---------- */

function CorporateMock({ item }: { item: (typeof WORK.items)[2] }) {
  const m = item.mock;
  const [open, setOpen] = useState(false);
  return (
    <div className="panel flex flex-1 flex-col gap-6" data-ui="corporate-preview">
      <p className="label muted">{m.label}</p>
      <p className="heading-4">{m.line}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn btn--secondary self-start"
      >
        {m.cta}
      </button>
      {open && (
        <div className="rounded-md border border-[color-mix(in_srgb,var(--p-ink)_12%,transparent)] p-6">
          <p className="heading-5">{m.line}</p>
          <a className="link link--blue mt-3 inline-block font-medium" href="#contact">
            {PRICING.footerCta}
          </a>
        </div>
      )}
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

export function Work() {
  return (
    <Section id="work" h={2} hm={3} attrs={{ "data-dim-orb": "" }}>
      <SectionHead eyebrow={WORK.eyebrow} title={WORK.h2} lead={WORK.meta} scrim />
      {/* Asymmetric grid (redesign skill): Koti's 7 / FORM 5, then the
          corporate build full-width and horizontal at xl. Below xl the
          two-column grid; corporate spans both columns at md. */}
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12" data-reveal-stagger>
        {WORK.items.map((item, i) => {
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
          const tags = (
            <div className="mb-6 flex flex-wrap gap-2">
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
          const mock =
            item.n === "01" ? (
              <RestaurantMock item={WORK.items[0]} />
            ) : item.n === "02" ? (
              <FormMock item={WORK.items[1]} />
            ) : (
              <CorporateMock item={WORK.items[2]} />
            );

          // Corporate: full-width, text left and mock right at xl.
          if (i === 2) {
            return (
              <article
                key={item.n}
                data-reveal-item
                className="card card--lift flex flex-col p-6 md:col-span-2 xl:col-span-12 xl:flex-row xl:gap-8"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  {head}
                  {claim}
                  {tags}
                </div>
                <div className="mt-6 flex min-w-0 flex-1 flex-col xl:mt-0">{mock}</div>
              </article>
            );
          }

          return (
            <article
              key={item.n}
              data-reveal-item
              className={`card card--lift flex flex-col p-6 ${i === 0 ? "xl:col-span-7" : "xl:col-span-5"}`}
            >
              {head}
              {claim}
              {tags}
              {mock}
            </article>
          );
        })}
      </div>
      <div className="mt-12" data-reveal>
        <a href="#pricing" className="link link--blue tap44 gap-2">
          See pricing
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
