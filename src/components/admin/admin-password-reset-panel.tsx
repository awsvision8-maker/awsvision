"use client";

import { useState } from "react";
import { KeyRound, Loader2, Mail, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPasswordResetPanelProps {
  userId: string;
  userName: string;
  userEmail: string;
}

function generateTempPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function AdminPasswordResetPanel({
  userId,
  userName,
  userEmail,
}: AdminPasswordResetPanelProps) {
  const [newPassword, setNewPassword] = useState("");
  const [emailPassword, setEmailPassword] = useState(true);
  const [busy, setBusy] = useState<"set" | "link" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPassword, setLastPassword] = useState<string | null>(null);

  const canSet = newPassword.trim().length >= 8;

  const setPassword = async () => {
    if (!canSet) {
      setError("Password must be at least 8 characters");
      return;
    }
    setBusy("set");
    setError(null);
    setMessage(null);
    setLastPassword(null);
    const password = newPassword.trim();
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set",
          newPassword: password,
          emailPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to set password");
      setMessage(data.message ?? "Password updated");
      setLastPassword(password);
      setNewPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set password");
    } finally {
      setBusy(null);
    }
  };

  const sendLink = async () => {
    setBusy("link");
    setError(null);
    setMessage(null);
    setLastPassword(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_link" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send reset link");
      setMessage(data.message ?? `Reset link emailed to ${userEmail}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reset link");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200/80">
          <KeyRound className="h-5 w-5 text-slate-700" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">Reset password</h2>
          <p className="mt-1 text-sm text-slate-600">
            When {userName} asks for help signing in, set a temporary password or email them a
            reset link ({userEmail}). Setting a password signs them out of all devices.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-800">New password</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setNewPassword(generateTempPassword())}
                  title="Generate password"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={emailPassword}
                onChange={(e) => setEmailPassword(e.target.checked)}
                className="rounded border-slate-300"
              />
              Email temporary password to customer
            </label>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={!canSet || busy !== null}
                onClick={() => void setPassword()}
              >
                {busy === "set" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Set password
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy !== null}
                onClick={() => void sendLink()}
              >
                {busy === "link" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Email reset link
              </Button>
            </div>
          </div>

          {lastPassword && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Temporary password (copy now):{" "}
              <code className="font-mono font-semibold">{lastPassword}</code>
            </p>
          )}
          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
