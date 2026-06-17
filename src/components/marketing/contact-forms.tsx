"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SITE } from "@/lib/site-data";

const APPOINTMENT_TOPICS = [
  { value: "Open an Account", label: "Open an Account" },
  { value: "Investment Consultation", label: "Investment Consultation" },
  { value: "Loan / Mortgage", label: "Loan / Mortgage" },
  { value: "Business Banking", label: "Business Banking" },
  { value: "General Inquiry", label: "General Inquiry" },
];

const fieldClass =
  "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 [color-scheme:light]";

async function postJson(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: (data as { error?: string }).error };
}

function SuccessBanner({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-emerald-800">{message}</p>
        <p className="mt-1 text-xs text-emerald-700">
          A confirmation email has been sent. Check your inbox (and spam folder).
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-2 text-xs font-medium text-emerald-700 underline"
          >
            Send another
          </button>
        )}
      </div>
    </div>
  );
}

export function ContactMessageForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Investment & Portfolio Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setTopic("Investment & Portfolio Inquiry");
    setMessage("");
    setDone(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await postJson("/api/contact/message", {
      firstName,
      lastName,
      email,
      phone,
      topic,
      message,
    });
    setLoading(false);
    if (result.ok) setDone(true);
    else setError(result.error || "Failed to send message");
  };

  if (done) {
    return <SuccessBanner message="Your message has been sent." onReset={reset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Phone" type="tel" placeholder={SITE.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
        <select
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option>Investment & Portfolio Inquiry</option>
          <option>Open an Account</option>
          <option>Account Support</option>
          <option>Withdrawal / Deposit Request</option>
          <option>Institutional Partnership</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
        <textarea
          rows={4}
          required
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="How can we help you?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading}>Send Message</Button>
    </form>
  );
}

export function WaitlistForm({
  listType,
  buttonLabel,
  inputClassName,
  buttonClassName,
}: {
  listType: "newsletter" | "products" | "credit_cards" | "loans";
  buttonLabel: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await postJson("/api/contact/waitlist", { email, listType });
    setLoading(false);
    if (result.ok) setDone(true);
    else setError(result.error || "Failed to join waitlist");
  };

  if (done) {
    return <SuccessBanner message="You're on the list — we'll email you when it's ready." />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end max-w-xl">
      <div className="flex-1">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
        />
      </div>
      <Button type="submit" loading={loading} className={`sm:mb-0 h-11 shrink-0 ${buttonClassName ?? ""}`}>
        {buttonLabel}
      </Button>
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
    </form>
  );
}

export function AppointmentForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [topic, setTopic] = useState("Open an Account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await postJson("/api/contact/appointment", {
      fullName,
      phone,
      email,
      preferredDate,
      topic,
    });
    setLoading(false);
    if (result.ok) setDone(true);
    else setError(result.error || "Failed to request appointment");
  };

  if (done) {
    return (
      <div className="mt-6 max-w-2xl">
        <SuccessBanner message="Appointment request received — we'll confirm by email." />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 max-w-2xl rounded-xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-black/5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder={SITE.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder={SITE.email}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-1.5">
          <label htmlFor="appointment-date" className="block text-sm font-medium text-slate-700">
            Preferred Date
          </label>
          <input
            id="appointment-date"
            type="date"
            className={fieldClass}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Select
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            options={APPOINTMENT_TOPICS}
          />
        </div>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            Request Appointment
          </Button>
        </div>
      </div>
    </form>
  );
}

export function ProductsWaitlistSection() {
  return (
    <>
      <WaitlistForm listType="products" buttonLabel="Join Waitlist" />
      <p className="mt-4 text-sm text-teal-700">
        Ready to open now?{" "}
        <Link href="/signup" className="font-semibold hover:underline">
          Apply for Savings, FD, or Investment →
        </Link>
      </p>
    </>
  );
}
