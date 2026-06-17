import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { SITE } from "@/lib/site-config";

export interface MailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set in environment");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  return transporter;
}

export function mailFrom() {
  return process.env.SMTP_FROM || `"AWS Vision" <${process.env.SMTP_USER}>`;
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || "awsvision8@gmail.com";
}

export async function sendMail(payload: MailPayload) {
  const transport = getTransporter();
  const to = Array.isArray(payload.to) ? payload.to.join(", ") : payload.to;

  await transport.sendMail({
    from: mailFrom(),
    to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo ?? SITE.email,
  });
}

/** Fire-and-forget — never blocks the API response */
export function sendMailAsync(payload: MailPayload) {
  void sendMail(payload).catch((err) => {
    console.error("[mail] Failed to send:", payload.subject, err);
  });
}
