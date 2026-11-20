"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT_SECTION } from "@/lib/content";
import { Section, SectionHead } from "./ui";
import WhatsAppFloat from "./WhatsAppFloat";

type Values = {
  name: string;
  email: string;
  project: string;
  details: string;
};

type Errors = Partial<Record<keyof Values, string>>;

type ApiResponse = {
  ok?: boolean;
  channel?: string;
  whatsappUrl?: string;
  errors?: Record<string, string>;
};

const FIELD_ORDER: (keyof Values)[] = ["name", "email", "project", "details"];

// Matches the server validation in src/app/api/plan/route.ts.
function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Write your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Write an email address with an @.";
  if (!(CONTACT_SECTION.form.projectOptions as readonly string[]).includes(values.project))
    errors.project = "Choose a project.";
  if (values.details.trim().length > 1000)
    errors.details = "Keep the short version under 1000 characters.";
  return errors;
}

export default function Contact() {
  const form = CONTACT_SECTION.form;
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    project: "",
    details: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<HTMLSelectElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const fieldRefs = { name: nameRef, email: emailRef, project: projectRef, details: detailsRef };

  function setValue<K extends keyof Values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setWhatsappUrl(null);
    if (Object.keys(errs).length > 0) {
      const count = Object.keys(errs).length;
      setStatus(`Please fix ${count} field${count === 1 ? "" : "s"} below.`);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) fieldRefs[first].current?.focus();
      return;
    }

    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: ApiResponse | null = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setErrors({});
        setStatus(form.sent);
        if (data.channel === "whatsapp" && data.whatsappUrl) {
          setWhatsappUrl(data.whatsappUrl);
        }
        return;
      }
      if (data?.errors && Object.keys(data.errors).length > 0) {
        const serverErrors = data.errors as Errors;
        setErrors(serverErrors);
        const count = Object.keys(serverErrors).length;
        setStatus(`Please fix ${count} field${count === 1 ? "" : "s"} below.`);
        const first = FIELD_ORDER.find((k) => serverErrors[k]);
        if (first) fieldRefs[first].current?.focus();
        return;
      }
      setStatus(form.error);
    } catch {
      setStatus(form.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <Section id="contact" h={2} hm={2}>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <SectionHead
            eyebrow={CONTACT_SECTION.eyebrow}
            title={CONTACT_SECTION.h2}
            lead={CONTACT_SECTION.meta}
          />
          <p className="lead muted -mt-6 mb-10 max-w-[62ch] md:-mt-8">
            {CONTACT_SECTION.body}
          </p>

          <div className="mb-8 w-fit rounded-lg bg-panel p-4">
            <ul className="flex flex-col gap-4">
            {CONTACT_SECTION.channels.map((ch) => (
              <li key={ch.label} className="flex flex-wrap items-baseline gap-3">
                <span className="label muted">{ch.label}</span>
                {ch.href ? (
                  <a
                    href={ch.href}
                    {...(ch.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="link link--gold tap44"
                  >
                    {ch.value}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div>
          <form
            data-ui="free-plan-form"
            onSubmit={onSubmit}
            noValidate
            aria-label={CONTACT_SECTION.h2}
            className="flex max-w-[640px] flex-col gap-5"
          >
            <div className="grid gap-6 md:grid-cols-2">
            <div className="field">
              <label htmlFor="contact-name">{form.nameLabel}</label>
              <input
                id="contact-name"
                ref={nameRef}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setValue("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errors.name ? (
                <p id="contact-name-error" className="field__error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="contact-email">{form.emailLabel}</label>
              <input
                id="contact-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {errors.email ? (
                <p id="contact-email-error" className="field__error">
                  {errors.email}
                </p>
              ) : null}
            </div>
            </div>

            <div className="field">
              <label htmlFor="contact-project">{form.projectLabel}</label>
              <select
                id="contact-project"
                ref={projectRef}
                value={values.project}
                onChange={(e) => setValue("project", e.target.value)}
                aria-invalid={Boolean(errors.project)}
                aria-describedby={errors.project ? "contact-project-error" : undefined}
              >
                <option value="">Choose a project</option>
                {form.projectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.project ? (
                <p id="contact-project-error" className="field__error">
                  {errors.project}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="contact-details">{form.detailsLabel}</label>
              <textarea
                id="contact-details"
                ref={detailsRef}
                placeholder={form.detailsPlaceholder}
                value={values.details}
                onChange={(e) => setValue("details", e.target.value)}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={errors.details ? "contact-details-error" : undefined}
              />
              {errors.details ? (
                <p id="contact-details-error" className="field__error">
                  {errors.details}
                </p>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                disabled={sending}
                className="btn btn--primary"
              >
                {sending ? form.sending : form.submit}
              </button>
              <p role="status" className="form__status">
                {status}
              </p>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary mt-4"
                >
                  Send via WhatsApp
                </a>
              ) : null}
            </div>
          </form>

          <p className="label mt-10">{form.note}</p>
        </div>
      </div>
      <WhatsAppFloat />
    </Section>
  );
}
