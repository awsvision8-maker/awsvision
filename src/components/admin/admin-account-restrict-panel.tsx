"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ban, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/site-config";

interface AdminAccountRestrictPanelProps {
  userId: string;
  userName: string;
  initiallyRestricted: boolean;
  initialNote?: string | null;
  restrictedAt?: string | null;
}

export function AdminAccountRestrictPanel({
  userId,
  userName,
  initiallyRestricted,
  initialNote,
  restrictedAt,
}: AdminAccountRestrictPanelProps) {
  const router = useRouter();
  const [restricted, setRestrictedState] = useState(initiallyRestricted);
  const [restrictedAtLocal, setRestrictedAtLocal] = useState(restrictedAt ?? null);
  const [savedNote, setSavedNote] = useState(initialNote ?? null);
  const [note, setNote] = useState(initialNote ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const setRestricted = async (next: boolean) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountRestricted: next,
          accountRestrictedNote: next ? note.trim() || null : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update restriction");
      setRestrictedState(next);
      setRestrictedAtLocal(next ? new Date().toISOString() : null);
      setSavedNote(next ? note.trim() || null : null);
      setMessage(
        next
          ? `${userName}'s account is now restricted. They will only see the support notice.`
          : `${userName}'s account restriction was lifted.`
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={
        restricted
          ? "rounded-xl border border-red-300 bg-red-50/70 p-4 sm:p-5"
          : "rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={
            restricted
              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100"
              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200/80"
          }
        >
          {restricted ? (
            <Ban className="h-5 w-5 text-red-600" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-slate-700" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2
            className={
              restricted
                ? "text-lg font-semibold text-red-950"
                : "text-lg font-semibold text-slate-900"
            }
          >
            Account restriction
          </h2>
          <p
            className={
              restricted
                ? "mt-1 text-sm text-red-900/80"
                : "mt-1 text-sm text-slate-600"
            }
          >
            Restrict this client so most portal features are locked. On login they see a notice to
            contact <strong>{SITE.email}</strong>. <strong>Deposit Funds</strong> stays available;
            withdraw and other actions stay blocked.
          </p>

          {restricted && (
            <p className="mt-3 rounded-lg border border-red-200 bg-white/80 px-3 py-2 text-sm text-red-950">
              <strong>Currently restricted</strong>
              {restrictedAtLocal ? ` · since ${formatDate(restrictedAtLocal)}` : ""}
              {savedNote ? (
                <>
                  <br />
                  <span className="text-red-900/80">Note: {savedNote}</span>
                </>
              ) : null}
            </p>
          )}

          <label className="mt-4 block text-sm">
            <span className="font-medium text-slate-800">Internal note (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Reason for restriction (admin only)"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {!restricted ? (
              <Button
                type="button"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                disabled={busy}
                onClick={() => void setRestricted(true)}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                Restrict account
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={() => void setRestricted(false)}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Lift restriction
              </Button>
            )}
          </div>

          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
