"use client";

import { useCallback, useState } from "react";
import { Download, FileCheck, Loader2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvestmentAgreementPDF } from "@/lib/investment-agreement-pdf";
import { INVESTMENT_PLANS } from "@/lib/investment-plans";
import type { InvestmentAgreement } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AdminInvestmentAgreementsPanelProps {
  userId: string;
  agreements: InvestmentAgreement[];
  onUpdated: () => void;
  emptyMessage?: string;
}

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

export function AdminInvestmentAgreementsPanel({
  userId,
  agreements,
  onUpdated,
  emptyMessage = "No agreements yet. Approve a deposit after KYC verification to generate the enrollment PDF.",
}: AdminInvestmentAgreementsPanelProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    planId: "",
    planName: "",
    monthlyRatePercent: "",
    termMonths: "",
    totalRoiPercent: "",
    totalPrincipal: "",
    maturityDate: "",
    amendmentNote: "",
  });

  const openEdit = (agreement: InvestmentAgreement) => {
    setEditingId(agreement.id);
    setError(null);
    setMessage(null);
    setForm({
      planId: agreement.planId,
      planName: agreement.planName,
      monthlyRatePercent: String(agreement.monthlyRatePercent),
      termMonths: String(agreement.termMonths),
      totalRoiPercent: String(agreement.totalRoiPercent),
      totalPrincipal: String(agreement.totalPrincipal),
      maturityDate: toDateInput(agreement.maturityDate),
      amendmentNote: agreement.amendmentNote ?? "",
    });
  };

  const applyPlanPreset = (planId: string) => {
    const plan = INVESTMENT_PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setForm((f) => ({
      ...f,
      planId: plan.id,
      planName: plan.name,
      monthlyRatePercent: String(plan.monthlyRate),
      termMonths: String(plan.termMonths),
      totalRoiPercent: String(plan.totalRoiPercent),
    }));
  };

  const recalcRoi = () => {
    const rate = parseFloat(form.monthlyRatePercent) || 0;
    const term = parseInt(form.termMonths, 10) || 0;
    if (rate > 0 && term > 0) {
      setForm((f) => ({ ...f, totalRoiPercent: String(Math.round(rate * term * 10) / 10) }));
    }
  };

  const handleDownload = useCallback(async (agreement: InvestmentAgreement) => {
    setDownloadingId(agreement.id);
    try {
      await generateInvestmentAgreementPDF(agreement);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const saveAgreement = async (agreementId: string) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/agreements/${agreementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: form.planId,
          planName: form.planName,
          monthlyRatePercent: parseFloat(form.monthlyRatePercent),
          termMonths: parseInt(form.termMonths, 10),
          totalRoiPercent: parseFloat(form.totalRoiPercent),
          totalPrincipal: parseFloat(form.totalPrincipal),
          maturityDate: form.maturityDate
            ? new Date(form.maturityDate).toISOString()
            : undefined,
          amendmentNote: form.amendmentNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");

      setMessage("Agreement updated — client account and PDF terms synced.");
      setEditingId(null);
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (agreements.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-800">{error}</p>
      )}

      {agreements.map((agreement) => (
        <div
          key={agreement.id}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <FileCheck className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">
                    {agreement.planName} — {agreement.agreementNumber}
                  </p>
                  {agreement.amendedAt && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                      Amended
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {formatCurrency(agreement.totalPrincipal)} capital ·{" "}
                  <strong className="text-teal-700">{agreement.monthlyRatePercent}%/mo</strong> ·{" "}
                  {agreement.termMonths} mo · {agreement.totalRoiPercent}% total return
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Issued {formatDate(agreement.issuedAt)}</span>
                  {agreement.amendedAt && (
                    <span>Updated {formatDate(agreement.amendedAt)}</span>
                  )}
                  <span>Maturity {formatDate(agreement.maturityDate)}</span>
                </div>
                {agreement.amendmentNote && (
                  <p className="mt-2 text-xs text-amber-800 bg-amber-50 rounded px-2 py-1 inline-block">
                    Special terms: {agreement.amendmentNote}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={downloadingId === agreement.id}
                onClick={() => void handleDownload(agreement)}
              >
                {downloadingId === agreement.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  editingId === agreement.id ? setEditingId(null) : openEdit(agreement)
                }
              >
                {editingId === agreement.id ? (
                  <>
                    <X className="h-4 w-4" /> Close
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" /> Edit terms
                  </>
                )}
              </Button>
            </div>
          </div>

          {editingId === agreement.id && (
            <div className="border-t border-slate-100 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Update program terms (special offers)
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Changes sync to the client&apos;s account rate and their downloadable agreement PDF.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Base plan tier</span>
                  <select
                    value={form.planId}
                    onChange={(e) => applyPlanPreset(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {INVESTMENT_PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.monthlyRate}%/mo · {p.termMonths} mo)
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Display plan name</span>
                  <input
                    type="text"
                    value={form.planName}
                    onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))}
                    placeholder="e.g. Gold (Special Offer)"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Monthly profit rate (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={form.monthlyRatePercent}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, monthlyRatePercent: e.target.value }))
                    }
                    onBlur={recalcRoi}
                    className={cn(
                      "mt-1 w-full rounded-lg border px-3 py-2 text-sm font-semibold",
                      parseFloat(form.monthlyRatePercent) >
                        (INVESTMENT_PLANS.find((p) => p.id === form.planId)?.monthlyRate ?? 0)
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-slate-200"
                    )}
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Program tenure (months)</span>
                  <input
                    type="number"
                    min="1"
                    value={form.termMonths}
                    onChange={(e) => setForm((f) => ({ ...f, termMonths: e.target.value }))}
                    onBlur={recalcRoi}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Total program return (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.totalRoiPercent}
                    onChange={(e) => setForm((f) => ({ ...f, totalRoiPercent: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Total capital ($)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.totalPrincipal}
                    onChange={(e) => setForm((f) => ({ ...f, totalPrincipal: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Maturity date</span>
                  <input
                    type="date"
                    value={form.maturityDate}
                    onChange={(e) => setForm((f) => ({ ...f, maturityDate: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-slate-700">
                    Amendment / special offer note (shown on PDF)
                  </span>
                  <textarea
                    rows={2}
                    value={form.amendmentNote}
                    onChange={(e) => setForm((f) => ({ ...f, amendmentNote: e.target.value }))}
                    placeholder="e.g. Promotional rate increase: +0.5% monthly profit for 24 months per executive approval."
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-4 flex gap-2">
                <Button disabled={saving} onClick={() => void saveAgreement(agreement.id)}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save & sync to client
                </Button>
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
