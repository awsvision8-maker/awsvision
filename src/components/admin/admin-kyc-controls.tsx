"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Save, XCircle } from "lucide-react";
import { AdminActionButton, AdminStatusBadge } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

const KYC_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "resubmit_required", label: "Resubmit required" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
] as const;

interface AdminKycControlsProps {
  userId: string;
  kycStatus: string;
  onUpdated: () => void;
}

export function AdminKycControls({ userId, kycStatus, onUpdated }: AdminKycControlsProps) {
  const [status, setStatus] = useState(kycStatus);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const needsReview = ["pending", "submitted", "resubmit_required"].includes(kycStatus);

  const saveStatus = async () => {
    if (status === kycStatus) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update status");
      setMessage("KYC status updated");
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const kycAction = async (action: "approve" | "reject") => {
    setActing(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action failed");
      setStatus(action === "approve" ? "verified" : "rejected");
      setMessage(action === "approve" ? "KYC approved" : "KYC rejected");
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">KYC verification</h2>
          <p className="mt-1 text-sm text-slate-500">
            Change status for any user, or request document re-uploads below.
          </p>
        </div>
        <AdminStatusBadge status={kycStatus} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          <span className="font-medium text-slate-700">KYC status</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {KYC_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          size="sm"
          onClick={() => void saveStatus()}
          disabled={saving || status === kycStatus}
          className="shrink-0"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save status
        </Button>
      </div>

      {needsReview && (
        <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="w-full text-sm font-medium text-amber-900">Quick review</p>
          <AdminActionButton variant="approve" disabled={acting} onClick={() => void kycAction("approve")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve KYC
          </AdminActionButton>
          <AdminActionButton variant="reject" disabled={acting} onClick={() => void kycAction("reject")}>
            <XCircle className="h-3.5 w-3.5" /> Reject KYC
          </AdminActionButton>
        </div>
      )}

      {kycStatus === "verified" && (
        <p className="mt-3 text-xs text-slate-500">
          Verified clients can still be asked to re-upload documents using the buttons in the KYC
          documents section below.
        </p>
      )}

      {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
