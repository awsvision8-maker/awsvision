"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarPlus, Megaphone, Save, ToggleLeft, ToggleRight } from "lucide-react";
import {
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

interface PromoConfig {
  id: string;
  isActive: boolean;
  displayMonth: number;
  displayYear: number;
  endsAt: string;
  minDeposit: number;
  returnPercent: number;
  termMonths: number;
  planId: string;
  packageName?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  updatedAt: string;
}

interface PromoPreview {
  packageName: string;
  monthLabel: string;
  endsLabel: string;
  headline: string;
  returnPercent: number;
  termMonths: number;
  minDeposit: number;
  badge: string;
}

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, i) => ({ value: String(i + 1), label }));

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminPromoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<PromoConfig | null>(null);
  const [preview, setPreview] = useState<PromoPreview | null>(null);
  const [offeringOpen, setOfferingOpen] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [displayMonth, setDisplayMonth] = useState(7);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [endsAtLocal, setEndsAtLocal] = useState("");
  const [minDeposit, setMinDeposit] = useState(50000);
  const [returnPercent, setReturnPercent] = useState(90);
  const [termMonths, setTermMonths] = useState(6);
  const [packageName, setPackageName] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");

  const applyPayload = useCallback(
    (data: { config: PromoConfig; promo: PromoPreview; offeringOpen: boolean }) => {
      setConfig(data.config);
      setPreview(data.promo);
      setOfferingOpen(data.offeringOpen);
      setIsActive(data.config.isActive);
      setDisplayMonth(data.config.displayMonth);
      setDisplayYear(data.config.displayYear);
      setEndsAtLocal(toDatetimeLocalValue(data.config.endsAt));
      setMinDeposit(data.config.minDeposit);
      setReturnPercent(data.config.returnPercent);
      setTermMonths(data.config.termMonths);
      setPackageName(data.config.packageName ?? "");
      setHeadline(data.config.headline ?? "");
      setSubheadline(data.config.subheadline ?? "");
    },
    []
  );

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/promo");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load promo");
      setLoading(false);
      return;
    }
    applyPayload(data);
    setLoading(false);
  }, [applyPayload]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (extra: Record<string, unknown> = {}) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive,
          displayMonth,
          displayYear,
          endsAt: endsAtLocal ? new Date(endsAtLocal).toISOString() : undefined,
          minDeposit: Number(minDeposit),
          returnPercent: Number(returnPercent),
          termMonths: Number(termMonths),
          packageName: packageName.trim() || null,
          headline: headline.trim() || null,
          subheadline: subheadline.trim() || null,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      applyPayload(data);
      setSuccess("Promotion updated. Public site will use these terms immediately.");
    } catch {
      setError("Failed to save promo config");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminPageHeader title="FD Promotion" description="Manage monthly Wealth Accelerator offer" />
        <AdminLoading />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="FD Promotion"
        description="Update month labels, terms, and enrollment deadline. Extend the program anytime."
      />

      <div className="space-y-6 p-4 sm:p-6">
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            offeringOpen
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-semibold">
            {offeringOpen ? "Live on website" : "Hidden from website"}
          </p>
          <p className="mt-1 text-xs opacity-90">
            {preview
              ? `${preview.badge} · ${preview.returnPercent}% / ${preview.termMonths} mo · ${preview.endsLabel}`
              : "No preview"}
            {config?.updatedAt ? ` · Updated ${formatDate(config.updatedAt)}` : ""}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Program status</p>
                <p className="text-xs text-slate-500">
                  When off (or past end date), banners and promo signup hide site-wide.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {isActive ? (
                  <ToggleRight className="h-5 w-5 text-teal-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-400" />
                )}
                {isActive ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Display month
                </label>
                <select
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  value={displayMonth}
                  onChange={(e) => setDisplayMonth(Number(e.target.value))}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Display year"
                type="number"
                min={2024}
                max={2100}
                value={displayYear}
                onChange={(e) => setDisplayYear(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="Enrollment ends (extend anytime)"
              type="datetime-local"
              value={endsAtLocal}
              onChange={(e) => setEndsAtLocal(e.target.value)}
              required
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Min deposit (USD)"
                type="number"
                min={1000}
                step={1000}
                value={minDeposit}
                onChange={(e) => setMinDeposit(Number(e.target.value))}
                required
              />
              <Input
                label="Total return %"
                type="number"
                min={1}
                max={500}
                step={1}
                value={returnPercent}
                onChange={(e) => setReturnPercent(Number(e.target.value))}
                required
              />
              <Input
                label="Term (months)"
                type="number"
                min={1}
                max={60}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="Package name (optional override)"
              placeholder="e.g. August Wealth Accelerator FD"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            />
            <Input
              label="Headline (optional override)"
              placeholder="Grow Your Wealth 90% in 6 Months"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Subheadline (optional override)
              </label>
              <textarea
                className="min-h-[88px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Leave blank to auto-generate from month + terms"
              />
            </div>

            <p className="text-xs text-slate-500">
              Plan ID stays <code className="rounded bg-slate-100 px-1">{config?.planId}</code> so
              existing promo clients keep their portal calculation. New signups use the terms above.
            </p>

            <Button type="submit" className="w-full sm:w-auto" loading={saving}>
              <Save className="mr-2 h-4 w-4" />
              Save promotion
            </Button>
          </form>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Megaphone className="h-4 w-4 text-teal-600" />
                Live preview
              </p>
              {preview ? (
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {preview.badge}
                  </p>
                  <p className="text-lg font-bold text-slate-900">{preview.packageName}</p>
                  <p>{preview.headline}</p>
                  <p className="text-xs text-slate-500">{preview.endsLabel}</p>
                  <p className="font-medium text-teal-800">
                    {preview.returnPercent}% · {preview.termMonths} months · $
                    {preview.minDeposit.toLocaleString("en-US")}+
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No preview available.</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CalendarPlus className="h-4 w-4 text-teal-600" />
                Quick actions
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={saving}
                onClick={() => void save({ rollToCurrentMonth: true })}
              >
                Roll labels to this calendar month + end of month
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={saving}
                onClick={() => void save({ rollToNextMonth: true })}
              >
                Roll to next month + extend to that month end
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={saving}
                onClick={() => void save({ extendDays: 30 })}
              >
                Extend enrollment +30 days
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={saving}
                onClick={() => void save({ extendDays: 7 })}
              >
                Extend enrollment +7 days
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
