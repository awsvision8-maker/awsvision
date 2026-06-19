"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, Bell, Trash2 } from "lucide-react";
import { AdminActionButton } from "@/components/admin/admin-ui";

interface AdminDeleteUserPanelProps {
  userId: string;
  email: string;
  name: string;
}

export function AdminDeleteUserPanel({ userId, email, name }: AdminDeleteUserPanelProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmEmail.trim().toLowerCase() === email.toLowerCase();

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete account");
        return;
      }
      router.replace("/admin/users");
    } catch {
      setError("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-red-200 bg-red-50/50 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-red-900">Danger zone</h2>
          <p className="mt-1 text-sm text-red-800">
            Permanently delete <strong>{name}</strong>&apos;s account, portfolio data, KYC records,
            and all related history. This cannot be undone.
          </p>

          {!confirmOpen ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
              <a
                href={`/admin/notifications?userId=${userId}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                Send notification
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-red-200 bg-white p-4">
              <p className="text-sm text-slate-700">
                Type <strong>{email}</strong> to confirm deletion:
              </p>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="mt-2 w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder={email}
                autoComplete="off"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!canDelete || deleting}
                  onClick={() => void handleDelete()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting…" : "Permanently delete"}
                </button>
                <AdminActionButton
                  variant="reject"
                  disabled={deleting}
                  onClick={() => {
                    setConfirmOpen(false);
                    setConfirmEmail("");
                    setError(null);
                  }}
                >
                  Cancel
                </AdminActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
