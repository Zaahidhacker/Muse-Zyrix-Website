"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus } from "@phosphor-icons/react";
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
                aria-label={`Add ${dish.name}`}
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

const workImages = {
  "01": "/work-kitchen.webp",
  "02": "/work-objects.webp",
  "03": "/work-corporate.webp",
};

export function Work() {
  return (
    <Section id="work" tone="surface">
      <SectionHead title={WORK.h2} />
      <div className="work-grid">
        {WORK.items.map((item) => (
          <article className="work-project" key={item.n}>
            <div className="work-project__art">
              <Image
                src={workImages[item.n]}
                alt=""
                fill
                sizes="(max-width: 767px) 91vw, (max-width: 1279px) 50vw, 690px"
              />
            </div>
            <div className="work-project__details">
              <h3 className="heading-4">{item.title}</h3>
              <p className="work-project__claim">{item.claim}</p>
              <p className="muted text-sm">{item.tags.join(" · ")}</p>
              <details className="work-demo">
                <summary>
                  Try the demo
                  <Plus size={18} aria-hidden="true" />
                </summary>
                {item.n === "01" ? <RestaurantMock item={item} /> :
                  item.n === "02" ? <FormMock item={item} /> : <CorporateMock item={item} />}
              </details>
            </div>
          </article>
        ))}
      </div>
      <a href="#pricing" className="link link--blue tap44 mt-8 gap-2">
        See pricing
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </Section>
  );
}
