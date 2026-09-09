"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  referralCode: string;
  status: string;
}

interface AdminAmbassadorProfileEditorProps {
  ambassadorId: string;
  initial: ProfileFields;
  onSaved: () => void;
}

export function AdminAmbassadorProfileEditor({
  ambassadorId,
  initial,
  onSaved,
}: AdminAmbassadorProfileEditorProps) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [username, setUsername] = useState(initial.username);
  const [referralCode, setReferralCode] = useState(initial.referralCode);
  const [status, setStatus] = useState(initial.status);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(initial.firstName);
    setLastName(initial.lastName);
    setEmail(initial.email);
    setPhone(initial.phone);
    setUsername(initial.username);
    setReferralCode(initial.referralCode);
    setStatus(initial.status);
    setNewPassword("");
  }, [initial]);

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  const save = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body: Record<string, string> = {
        firstName,
        lastName,
        email,
        phone,
        username,
        referralCode,
        status,
      };
      if (newPassword.trim()) body.newPassword = newPassword.trim();

      const res = await fetch(`/api/admin/ambassadors/profile/${ambassadorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save profile");
      setMessage(
        newPassword.trim()
          ? "Profile updated and password reset"
          : "Ambassador profile updated"
      );
      setNewPassword("");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <UserCog className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
        <div className="flex-1">
          <h2 className="font-semibold text-slate-900">Edit ambassador profile</h2>
          <p className="mt-1 text-sm text-slate-600">
            Update name, contact details, login username, referral code, or reset password. Changes
            apply immediately to the ambassador portal.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">First name</span>
              <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Last name</span>
              <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
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
              <span className="font-medium text-slate-700">Phone</span>
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Username (login)</span>
              <input
                className={`${inputClass} font-mono`}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Referral code</span>
              <input
                className={`${inputClass} font-mono uppercase`}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Status</span>
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">New password (optional)</span>
              <input
                type="text"
                className={inputClass}
                value={newPassword}
                placeholder="Leave blank to keep current"
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
          </div>

          <Button size="sm" className="mt-4" disabled={saving} onClick={() => void save()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save profile
          </Button>

          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
