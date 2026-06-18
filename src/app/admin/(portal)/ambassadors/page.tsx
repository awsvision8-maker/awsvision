"use client";

import { useCallback, useEffect, useState } from "react";
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
  ambassador: { username: string; referralCode: string } | null;
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
        description="Review manager applications. On approval, login credentials are emailed automatically."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize cursor-pointer ${
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
                  <p className="text-sm text-slate-500">{app.email} · {app.phone}</p>
                  {(app.city || app.state) && (
                    <p className="text-xs text-slate-400">{[app.city, app.state].filter(Boolean).join(", ")}</p>
                  )}
                </div>
                {app.status === "pending" && (
                  <div className="flex gap-2">
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
                  </div>
                )}
              </div>
              {app.experience && (
                <p className="mt-3 text-sm text-slate-600"><strong>Experience:</strong> {app.experience}</p>
              )}
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{app.message}</p>
              {app.ambassador && (
                <p className="mt-3 text-xs text-teal-700">
                  Ambassador: {app.ambassador.username} · {app.ambassador.referralCode}
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
