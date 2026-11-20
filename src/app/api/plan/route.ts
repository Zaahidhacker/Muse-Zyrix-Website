import { NextResponse } from "next/server";
import { CONTACT_SECTION } from "@/lib/content";

const PROJECTS = CONTACT_SECTION.form.projectOptions;

type Enquiry = {
  name: string;
  email: string;
  project: string;
  details: string;
};

function validate(body: unknown): { ok: true; data: Enquiry } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const project = typeof b.project === "string" ? b.project.trim() : "";
  const details = typeof b.details === "string" ? b.details.trim() : "";

  if (name.length < 2) errors.name = "Write your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Write an email address with an @.";
  if (!(PROJECTS as readonly string[]).includes(project)) errors.project = "Choose a project.";
  if (details.length > 1000) errors.details = "Keep the short version under 1000 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, project, details } };
}

function whatsappUrl(data: Enquiry): string {
  const text = [
    "Hi Zyrix! Free plan request.",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Project: ${data.project}`,
    data.details ? `Details: ${data.details}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/94720551707?text=${encodeURIComponent(text)}`;
}

async function sendViaResend(data: Enquiry): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM ?? "Zyrix <hello@zyrix-agency.online>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ["zyrix.co@outlook.com"],
        reply_to: data.email,
        subject: `Free plan request — ${data.name} (${data.project})`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Project: ${data.project}`,
          "",
          data.details || "(No details given.)",
        ].join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "That request was not valid JSON." } }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const emailed = await sendViaResend(result.data);
  if (emailed) {
    return NextResponse.json({ ok: true, channel: "email" });
  }
  // No Resend key, or the send failed: hand the visitor a prefilled
  // WhatsApp message so the enquiry is never lost.
  return NextResponse.json({
    ok: true,
    channel: "whatsapp",
    whatsappUrl: whatsappUrl(result.data),
  });
}
