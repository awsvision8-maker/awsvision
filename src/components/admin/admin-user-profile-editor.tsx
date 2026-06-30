"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUserProfileEditorProps {
  userId: string;
  initial: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    kycStatus: string;
  };
  nonprofit?: {
    fundCapital: number;
    monthlyRate: number;
  } | null;
  onSaved: () => void;
}

export function AdminUserProfileEditor({
  userId,
  initial,
  nonprofit,
  onSaved,
}: AdminUserProfileEditorProps) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [kycStatus, setKycStatus] = useState(initial.kycStatus);
  const [fundCapital, setFundCapital] = useState(
    nonprofit ? String(nonprofit.fundCapital) : ""
  );
  const [npMonthlyRate, setNpMonthlyRate] = useState(
    nonprofit ? String(nonprofit.monthlyRate) : ""
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  const save = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body: Record<string, unknown> = {
        firstName,
        lastName,
        phone,
        email,
        kycStatus,
      };
      if (nonprofit) {
        body.nonprofit = {
          fundCapital: parseFloat(fundCapital) || 0,
          monthlyRate: parseFloat(npMonthlyRate) || 0,
        };
      }
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setMessage("Profile updated");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">User profile</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">First name</span>
          <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Last name</span>
          <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Phone</span>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">KYC status</span>
          <select
            className={inputClass}
            value={kycStatus}
            onChange={(e) => setKycStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="resubmit_required">Resubmit required</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {nonprofit && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">Non-profit fund settings</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Fund capital ($)</span>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={fundCapital}
                onChange={(e) => setFundCapital(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Monthly rate (%)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClass}
                value={npMonthlyRate}
                onChange={(e) => setNpMonthlyRate(e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <Button size="sm" className="mt-4" onClick={save} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save profile
      </Button>

      {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
