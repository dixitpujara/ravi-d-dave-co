import { NextResponse } from "next/server";
import { EMAIL, SITE_NAME } from "../../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  botcheck?: string;
};

const clean = (v: unknown, max = 2000) =>
  String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  let data: Body;
  try {
    data = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: silently accept bots without sending.
  if (clean(data.botcheck)) return NextResponse.json({ ok: true });

  const name = clean(data.name, 120);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 160);
  const service = clean(data.service, 120);
  const message = clean(data.message, 4000);

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name and phone number." },
      { status: 400 }
    );
  }

  const subject = `New website enquiry from ${name}${service ? " — " + service : ""}`;
  const lines = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || "-"}`,
    `Service: ${service || "-"}`,
    "",
    "Message:",
    message || "-",
  ];
  const text = lines.join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#14243f;line-height:1.6">
    <h2 style="margin:0 0 12px">New website enquiry</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Phone:</strong> ${esc(phone)}</p>
    <p><strong>Email:</strong> ${esc(email) || "-"}</p>
    <p><strong>Service:</strong> ${esc(service) || "-"}</p>
    <p><strong>Message:</strong><br/>${esc(message).replace(/\n/g, "<br/>") || "-"}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
    <p style="color:#6c7688;font-size:13px">Sent from the ${SITE_NAME} website contact form.</p>
  </div>`;

  const resendKey = process.env.RESEND_API_KEY;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

  try {
    // Preferred: Resend (professional sender). Works out of the box with the
    // onboarding@resend.dev sender to your own Resend account email.
    if (resendKey) {
      const from = process.env.CONTACT_FROM || "Ravi D Dave & Co. <onboarding@resend.dev>";
      const to = process.env.CONTACT_TO || EMAIL;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          html,
          reply_to: email || undefined,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { ok: false, error: (err as { message?: string }).message || "Email service error." },
        { status: 502 }
      );
    }

    // Alternative: Web3Forms (no domain / no npm dep; forwards to your inbox).
    if (web3Key) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3Key,
          subject,
          from_name: `${SITE_NAME} Website`,
          replyto: email || undefined,
          name,
          phone,
          email: email || "not provided",
          service: service || "-",
          message: message || "-",
        }),
      });
      const out = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && out.success) return NextResponse.json({ ok: true });
      return NextResponse.json(
        { ok: false, error: out.message || "Email service error." },
        { status: 502 }
      );
    }

    // Not configured yet.
    return NextResponse.json(
      {
        ok: false,
        error:
          "The contact form isn't fully set up yet. Please call or WhatsApp us for now.",
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please call or WhatsApp us." },
      { status: 500 }
    );
  }
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
