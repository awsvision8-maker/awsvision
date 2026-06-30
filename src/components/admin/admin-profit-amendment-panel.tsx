"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Percent, RotateCcw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INVESTMENT_PLANS, getInvestmentPlan } from "@/lib/investment-plans";
import { resolvePlanTierFromPrincipal } from "@/lib/portfolio-engine";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AccountRow {
  id: string;
  accountNumber: string;
  type: string;
  principal: number;
  monthlyRatePercent: number;
  investmentPlanId: string | null;
  profitRateAmended?: boolean;
  amendmentNote?: string | null;
}

interface AdminProfitAmendmentPanelProps {
  userId: string;
  accounts: AccountRow[];
  monthlyProfitEstimate: number;
  nextMonthRatePercent: number;
  onUpdated: () => void;
}

export function AdminProfitAmendmentPanel({
  userId,
  accounts,
  monthlyProfitEstimate,
  nextMonthRatePercent,
  onUpdated,
}: AdminProfitAmendmentPanelProps) {
  const investAccounts = accounts.filter(
    (a) => a.type === "investment" || a.type === "fixed_deposit"
  );

  const [accountId, setAccountId] = useState(investAccounts[0]?.id ?? "");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = investAccounts.find((a) => a.id === accountId);

  const standardPlan = selected
    ? resolvePlanTierFromPrincipal(
        {
          type: selected.type as "investment" | "fixed_deposit",
          investmentPlanId: selected.investmentPlanId ?? undefined,
        },
        selected.principal
      )
    : null;

  const standardRate = standardPlan?.monthlyRate ?? 0;
  const currentRate = selected?.monthlyRatePercent ?? 0;
  const previewRate = parseFloat(monthlyRate) || currentRate;
  const previewMonthlyProfit =
    selected && previewRate > 0
      ? Math.round(((selected.principal * previewRate) / 100) * 100) / 100
      : 0;

  useEffect(() => {
    if (!selected) return;
    setMonthlyRate(String(selected.monthlyRatePercent));
    setNote(selected.amendmentNote ?? "");
  }, [selected?.id, selected?.monthlyRatePercent, selected?.amendmentNote]);

  const save = useCallback(async () => {
    if (!accountId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/profit-amendment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          monthlyRatePercent: parseFloat(monthlyRate),
          amendmentNote: note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      const agreementNote =
        data.agreementSync?.action === "created"
          ? ` Investment agreement ${data.agreementSync.agreementNumber} generated.`
          : data.agreementSync?.action === "amended"
            ? ` Agreement ${data.agreementSync.agreementNumber} updated.`
            : data.agreementSync?.action === "skipped"
              ? ` Note: ${data.agreementSync.reason}`
              : "";
      setMessage(
        `Profit rate updated to ${data.account?.monthlyRatePercent}%/mo — portal, charts, and agreements now use this rate.${agreementNote}`
      );
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [accountId, monthlyRate, note, userId, onUpdated]);

  const resetToStandard = useCallback(async () => {
    if (!accountId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/profit-amendment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, clearAmendment: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reset failed");
      setMonthlyRate(String(data.standardRatePercent ?? standardRate));
      setNote("");
      setMessage(`Reset to standard ${data.standardPlanName ?? standardPlan?.name} rate (${data.standardRatePercent ?? standardRate}%/mo).`);
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  }, [accountId, userId, onUpdated, standardPlan?.name, standardRate]);

  if (investAccounts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        No investment or fixed deposit account to amend.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100">
          <Percent className="h-5 w-5 text-violet-700" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Profit rate amendment</h3>
          <p className="mt-1 text-sm text-slate-600">
            Override monthly profit % for this client. Dashboard, portfolio charts, monthly profit
            estimates, and agreements all follow the amended rate.
          </p>
        </div>
      </div>

      {selected?.profitRateAmended && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            <strong>Active amendment:</strong> {currentRate}%/mo
            {standardRate > 0 && currentRate !== standardRate && (
              <> (standard {standardPlan?.name}: {standardRate}%/mo)</>
            )}
          </span>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {investAccounts.length > 1 && (
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Account</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {investAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type.replace(/_/g, " ")} ···{a.accountNumber.slice(-4)} —{" "}
                  {formatCurrency(a.principal)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Standard tier rate</span>
          <p className="mt-1 text-lg font-bold text-slate-500">
            {standardPlan ? `${standardPlan.name} · ${standardRate}%/mo` : "—"}
          </p>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Amended monthly rate (%)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
            className={cn(
              "mt-1 w-full rounded-lg border px-3 py-2 text-sm font-bold",
              previewRate > standardRate
                ? "border-amber-400 bg-amber-50 text-amber-900"
                : "border-violet-300 bg-white text-violet-900"
            )}
          />
        </label>

        <label className="block text-sm sm:col-span-2 lg:col-span-4">
          <span className="font-medium text-slate-700">Amendment note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Executive special offer — +0.5% monthly profit"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Est. monthly profit (amended)</p>
          <p className="text-lg font-bold text-teal-700">{formatCurrency(previewMonthlyProfit)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Current portfolio estimate</p>
          <p className="text-lg font-semibold text-slate-800">
            {formatCurrency(monthlyProfitEstimate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Program rate shown to client</p>
          <p className="text-lg font-semibold text-slate-800">{nextMonthRatePercent}%/mo</p>
        </div>
      </div>

      {message && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled={saving} onClick={() => void save()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Apply amendment
        </Button>
        {selected?.profitRateAmended && (
          <Button variant="outline" disabled={saving} onClick={() => void resetToStandard()}>
            <RotateCcw className="h-4 w-4" />
            Reset to standard tier
          </Button>
        )}
        {standardPlan && (
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              const p = getInvestmentPlan(standardPlan.id);
              if (p) setMonthlyRate(String(p.monthlyRate));
            }}
          >
            Use {standardPlan.name} ({standardRate}%)
          </Button>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Quick presets:{" "}
        {INVESTMENT_PLANS.slice(0, 4).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setMonthlyRate(String(p.monthlyRate))}
            className="mr-2 text-violet-700 hover:underline cursor-pointer"
          >
            {p.name} {p.monthlyRate}%
          </button>
        ))}
      </p>
    </div>
  );
}
