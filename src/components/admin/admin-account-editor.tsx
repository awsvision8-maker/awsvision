"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Minus, Plus, Save } from "lucide-react";
import { AdminActionButton } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { INVESTMENT_PLANS } from "@/lib/investment-plans";
import {
  accountRatesForPrincipal,
  getAccountLabel,
  resolvePlanTierFromPrincipal,
} from "@/lib/portfolio-engine";
import { formatCurrency } from "@/lib/utils";

export interface AdminAccountData {
  id: string;
  accountNumber: string;
  type: string;
  principal: number;
  monthlyRatePercent: number;
  status: string;
  investmentPlanId: string | null;
  profitEligibleAt: string | null;
  maturityDate: string | null;
}

interface AdminAccountEditorProps {
  userId: string;
  account: AdminAccountData;
  onSaved: () => void;
}

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function AdminAccountEditor({ userId, account, onSaved }: AdminAccountEditorProps) {
  const [principal, setPrincipal] = useState(String(account.principal));
  const [monthlyRate, setMonthlyRate] = useState(String(account.monthlyRatePercent));
  const [planId, setPlanId] = useState(account.investmentPlanId ?? "");
  const [profitEligibleAt, setProfitEligibleAt] = useState(toDateInputValue(account.profitEligibleAt));
  const [status, setStatus] = useState(account.status);
  const [lockPlanManually, setLockPlanManually] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDesc, setAdjustDesc] = useState("Admin balance adjustment");
  const [saving, setSaving] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isInvestmentType =
    account.type === "investment" || account.type === "fixed_deposit";
  const tiersFromBalance =
    isInvestmentType || account.type === "savings";

  const principalNum = parseFloat(principal) || 0;

  const matchedFromBalance = useMemo(() => {
    if (!tiersFromBalance) return null;
    const acct = {
      type: account.type as "investment" | "fixed_deposit" | "savings",
      monthlyRatePercent: account.monthlyRatePercent,
      investmentPlanId: account.investmentPlanId ?? undefined,
    };
    const rates = accountRatesForPrincipal(acct, principalNum);
    const plan =
      account.type === "investment" || account.type === "fixed_deposit"
        ? resolvePlanTierFromPrincipal(acct, principalNum)
        : null;
    return { plan, rates };
  }, [account, principalNum, tiersFromBalance]);

  useEffect(() => {
    if (lockPlanManually || !matchedFromBalance) return;
    setMonthlyRate(String(matchedFromBalance.rates.monthlyRatePercent));
    if (matchedFromBalance.plan) {
      setPlanId(matchedFromBalance.plan.id);
    }
  }, [lockPlanManually, matchedFromBalance]);

  const saveAccount = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body: Record<string, unknown> = {
        principal: principalNum,
        profitEligibleAt: profitEligibleAt ? new Date(profitEligibleAt).toISOString() : null,
        status,
        autoMatchPlan: !lockPlanManually,
        recordAdjustment: true,
      };

      if (lockPlanManually) {
        body.monthlyRatePercent = parseFloat(monthlyRate) || 0;
        body.investmentPlanId = planId || null;
      }

      const res = await fetch(`/api/admin/users/${userId}/accounts/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      const planName = data.matchedPlan?.name;
      setMessage(
        planName
          ? `Saved — plan auto-matched to ${planName} (${data.matchedPlan.monthlyRate}%/mo)`
          : "Account updated — plan matched to balance"
      );
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const quickAdjust = async (direction: "credit" | "debit") => {
    const amount = parseFloat(adjustAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid adjustment amount");
      return;
    }
    setAdjusting(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/accounts/${account.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, direction, description: adjustDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Adjustment failed");
      const planNote = data.matchedPlan
        ? ` · Plan: ${data.matchedPlan.name} (${data.matchedPlan.monthlyRate}%/mo)`
        : "";
      setMessage(
        `${direction === "credit" ? "Credited" : "Debited"} ${formatCurrency(amount)}${planNote}`
      );
      setAdjustAmount("");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Adjustment failed");
    } finally {
      setAdjusting(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  const disabledClass = lockPlanManually ? "" : "bg-slate-50 text-slate-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">
            {getAccountLabel({
              type: account.type as "savings",
              investmentPlanId: account.investmentPlanId ?? undefined,
            })}
          </p>
          <p className="text-xs text-slate-500">{account.accountNumber}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-700">
          {account.status}
        </span>
      </div>

      {tiersFromBalance && !lockPlanManually && matchedFromBalance?.plan && (
        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          <strong>Plan for {formatCurrency(principalNum)}:</strong>{" "}
          {matchedFromBalance.plan.name} — {matchedFromBalance.plan.monthlyRate}% monthly
          <span className="mt-0.5 block text-xs text-teal-700">
            Updates automatically when you save balance or use credit/debit
          </span>
        </div>
      )}

      {tiersFromBalance && !lockPlanManually && account.type === "savings" && matchedFromBalance && (
        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          <strong>Savings rate for {formatCurrency(principalNum)}:</strong>{" "}
          {matchedFromBalance.rates.monthlyRatePercent.toFixed(2)}% monthly
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Balance / Principal ($)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Monthly profit rate (%)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={`${inputClass} ${disabledClass}`}
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
            readOnly={!lockPlanManually}
          />
        </label>

        {isInvestmentType && (
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Investment plan</span>
            <select
              className={`${inputClass} ${disabledClass}`}
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              disabled={!lockPlanManually}
            >
              <option value="">— None —</option>
              {INVESTMENT_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.monthlyRate}%/mo · min {formatCurrency(p.minInvestment)})
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Profit accrual starts</span>
          <input
            type="date"
            className={inputClass}
            value={profitEligibleAt}
            onChange={(e) => setProfitEligibleAt(e.target.value)}
          />
          <span className="mt-0.5 block text-xs text-slate-400">30-day hold — clear to disable</span>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Account status</span>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="matured">Matured</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        {tiersFromBalance && (
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={lockPlanManually}
              onChange={(e) => setLockPlanManually(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600"
            />
            <span className="text-slate-600">Lock plan & rate manually (disable auto-match)</span>
          </label>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={saveAccount} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save account
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-medium text-slate-800">Quick balance adjust</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Credit or debit — balance and plan tier update automatically from the new total.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">
            <span className="font-medium text-slate-700">Amount ($)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              placeholder="5000"
            />
          </label>
          <label className="flex-[2] text-sm">
            <span className="font-medium text-slate-700">Note</span>
            <input
              type="text"
              className={inputClass}
              value={adjustDesc}
              onChange={(e) => setAdjustDesc(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <AdminActionButton
              variant="approve"
              disabled={adjusting}
              onClick={() => quickAdjust("credit")}
            >
              <Plus className="h-3.5 w-3.5" /> Credit
            </AdminActionButton>
            <AdminActionButton
              variant="reject"
              disabled={adjusting}
              onClick={() => quickAdjust("debit")}
            >
              <Minus className="h-3.5 w-3.5" /> Debit
            </AdminActionButton>
          </div>
        </div>
      </div>

      {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
