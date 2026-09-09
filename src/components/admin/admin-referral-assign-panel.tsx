"use client";

import { useEffect, useState } from "react";
import { Link2, Loader2, Unlink, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedAmbassador {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  status: string;
}

interface AmbassadorOption {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
}

interface AdminReferralAssignPanelProps {
  userId: string;
  ambassador: LinkedAmbassador | null;
  onUpdated: () => void;
}

export function AdminReferralAssignPanel({
  userId,
  ambassador,
  onUpdated,
}: AdminReferralAssignPanelProps) {
  const [options, setOptions] = useState<AmbassadorOption[]>([]);
  const [selectedId, setSelectedId] = useState(ambassador?.id ?? "");
  const [manualCode, setManualCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(ambassador?.id ?? "");
  }, [ambassador?.id]);

  useEffect(() => {
    fetch("/api/admin/ambassadors/active")
      .then((r) => r.json())
      .then((d) => setOptions(d.ambassadors ?? []))
      .catch(() => setOptions([]));
  }, []);

  const assign = async (body: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update referral link");
      setMessage(
        body.clear
          ? "Referral link removed — client no longer on any ambassador dashboard"
          : "Client linked to brand ambassador — they will appear on that dashboard"
      );
      setManualCode("");
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <UserPlus className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
        <div>
          <h3 className="font-semibold text-slate-900">Brand ambassador / referral</h3>
          <p className="mt-1 text-sm text-slate-600">
            Link this existing client to a brand ambassador so they show on that ambassador&apos;s
            dashboard. Same effect as signing up with their referral code.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-violet-100 bg-white px-4 py-3 text-sm">
        {ambassador ? (
          <p className="text-slate-800">
            Currently linked to{" "}
            <strong>
              {ambassador.firstName} {ambassador.lastName}
            </strong>{" "}
            (<span className="font-mono text-violet-800">{ambassador.referralCode}</span>) —{" "}
            {ambassador.email}
          </p>
        ) : (
          <p className="text-slate-600">Not linked to any brand ambassador.</p>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Select ambassador</span>
          <select
            className={inputClass}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">— Choose ambassador —</option>
            {options.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.referralCode}) · {a.referralCount} clients
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Or paste referral code</span>
          <input
            className={`${inputClass} font-mono uppercase`}
            placeholder="e.g. AV-XXXXXX"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={saving || (!selectedId && !manualCode.trim())}
          onClick={() =>
            assign(
              manualCode.trim()
                ? { referralCode: manualCode.trim() }
                : { ambassadorId: selectedId }
            )
          }
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
          Assign / update link
        </Button>
        {ambassador && (
          <Button
            size="sm"
            variant="outline"
            disabled={saving}
            onClick={() => assign({ clear: true })}
          >
            <Unlink className="h-4 w-4" />
            Remove link
          </Button>
        )}
      </div>

      {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
