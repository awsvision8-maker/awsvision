"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import {
  AdminActionButton,
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import { KycDocumentViewer } from "@/components/admin/kyc-document-viewer";
import { formatDate } from "@/lib/utils";

interface KycUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycStatus: string;
  profileType: string;
  createdAt: string;
  kycData: Record<string, string> | null;
  pendingRequests: { documentKey: string; adminNote?: string | null }[];
}

export default function AdminKycPage() {
  const [users, setUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/kyc");
    const data = await res.json();
    if (res.ok) setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (userId: string, action: "approve" | "reject") => {
    setActing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) await load();
    } finally {
      setActing(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="KYC Review"
        description="Verify identity documents submitted during account opening."
      />

      {users.length === 0 ? (
        <AdminEmptyState title="No pending KYC reviews" description="All clients are verified or none awaiting review." />
      ) : (
        <div className="mt-8 space-y-4">
          {users.map((u) => (
            <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {u.firstName} {u.lastName}
                  </h2>
                  <p className="text-sm text-slate-600">{u.email} · {u.phone}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Registered {formatDate(u.createdAt)} · <span className="capitalize">{u.profileType}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge status={u.kycStatus} />
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Full profile <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {u.kycData && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                    className="text-sm font-medium text-teal-600 hover:underline cursor-pointer"
                  >
                    {expanded === u.id ? "Hide" : "View"} KYC documents
                  </button>
                  {expanded === u.id && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                      <KycDocumentViewer
                        kycData={u.kycData}
                        userId={u.id}
                        profileType={u.profileType}
                        pendingRequests={u.pendingRequests}
                        onReuploadRequested={() => void load()}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <AdminActionButton
                  variant="approve"
                  disabled={acting === u.id}
                  onClick={() => act(u.id, "approve")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve KYC
                </AdminActionButton>
                <AdminActionButton
                  variant="reject"
                  disabled={acting === u.id}
                  onClick={() => act(u.id, "reject")}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </AdminActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
