"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AmbassadorApplicationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    linkedin: "",
    experience: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact/brand-ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-xl font-bold text-emerald-900">Application Submitted</h3>
        <p className="mt-2 text-sm text-emerald-800">
          Thank you! Our team will review your application. If approved, you will receive your manager portal login and referral link by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">Apply to Join AWS Vision</h3>
      <p className="text-sm text-slate-600">Complete the form below. Fields marked * are required.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        <Input label="Last Name *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Phone *" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Input label="LinkedIn (optional)" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="sm:col-span-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Relevant experience</label>
        <textarea
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Sales, finance, networking, prior ambassador roles..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Why do you want to join? *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Tell us about your network and how you will represent AWS Vision..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full sm:w-auto" loading={loading}>
        Submit Application
      </Button>
    </form>
  );
}
