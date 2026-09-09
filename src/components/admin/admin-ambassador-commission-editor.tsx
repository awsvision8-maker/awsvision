"use client";

import { useEffect, useState } from "react";
import { Loader2, Percent, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminAmbassadorCommissionEditorProps {
  ambassadorId: string;
  initialRatePercent: number;
  onSaved: () => void;
}

export function AdminAmbassadorCommissionEditor({
  ambassadorId,
  initialRatePercent,
  onSaved,
}: AdminAmbassadorCommissionEditorProps) {
  const [rate, setRate] = useState(String(initialRatePercent));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRate(String(initialRatePercent));
  }, [initialRatePercent]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const value = parseFloat(rate);
      if (!Number.isFinite(value)) throw new Error("Enter a valid commission percent");
      const res = await fetch(`/api/admin/ambassadors/profile/${ambassadorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionRatePercent: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save commission");
      setMessage(`Commission set to ${data.commissionRatePercent}% — totals recalculated`);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <Percent className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="flex-1">
          <h2 className="font-semibold text-slate-900">Commission rate (admin assigned)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Set this ambassador&apos;s commission as a percent of each referred client&apos;s{" "}
            <strong>first approved deposit</strong>. Changing the rate recalculates earned and
            pending commission on their dashboard.
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Rate (%)</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </label>
            <Button size="sm" disabled={saving} onClick={() => void save()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save commission
            </Button>
          </div>

          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
