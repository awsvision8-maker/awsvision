"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AdminEmptyState, AdminPageHeader, AdminStatusBadge } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  state: string | null;
  linkedin: string | null;
  experience: string | null;
  message: string;
  status: string;
  createdAt: string;
  ambassador: {
    id: string;
    username: string;
    referralCode: string;
    status: string;
    approvedAt: string;
    referralCount: number;
    commissionRatePercent: number;
  } | null;
}

export default function AdminAmbassadorsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const q = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/admin/ambassadors${q}`);
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications ?? []);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    await fetch(`/api/admin/ambassadors/${id}/approve`, { method: "POST" });
    await load();
    setLoadingId(null);
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    await fetch(`/api/admin/ambassadors/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewNote: "Application not approved at this time." }),
    });
    await load();
    setLoadingId(null);
  };

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Brand Ambassador Applications"
        description="Review applications. Open an approved ambassador profile for clients, commission, and full details."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === f ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <AdminEmptyState title="No applications in this queue." />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {app.firstName} {app.lastName}
                    </h3>
                    <AdminStatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-slate-500">
                    {app.email} · {app.phone}
                  </p>
                  {(app.city || app.state) && (
                    <p className="text-xs text-slate-400">
                      {[app.city, app.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.ambassador && (
                    <Link
                      href={`/admin/ambassadors/${app.ambassador.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                      Open full profile <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {app.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        loading={loadingId === app.id}
                        onClick={() => void handleApprove(app.id)}
                      >
                        Approve & Send Login
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === app.id}
                        onClick={() => void handleReject(app.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {app.experience && (
                <p className="mt-3 text-sm text-slate-600">
                  <strong>Experience:</strong> {app.experience}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{app.message}</p>
              {app.ambassador && (
                <p className="mt-3 text-xs text-teal-700">
                  Ambassador: {app.ambassador.username} · {app.ambassador.referralCode} ·{" "}
                  {app.ambassador.referralCount} referred client
                  {app.ambassador.referralCount === 1 ? "" : "s"}
                  {typeof app.ambassador.commissionRatePercent === "number"
                    ? ` · ${app.ambassador.commissionRatePercent}% commission`
                    : ""}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Applied {new Date(app.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
