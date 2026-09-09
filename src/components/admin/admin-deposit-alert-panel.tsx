"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface AdminDepositAlertPanelProps {
  userId: string;
  userName: string;
}

export function AdminDepositAlertPanel({ userId, userName }: AdminDepositAlertPanelProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount);
  const canSend = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const send = async () => {
    if (!canSend) {
      setError("Enter the outstanding deposit amount");
      return;
    }
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/deposit-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountDue: parsedAmount,
          note: note.trim() || undefined,
          durationDays: 30,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send alert");
      setMessage(
        `Red alert sent to ${userName} for ${formatCurrency(parsedAmount)}. They will see it on the dashboard and receive an email.`
      );
      setAmount("");
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send alert");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-red-950">Deposit shortfall alert</h2>
          <p className="mt-1 text-sm text-red-900/80">
            Send a red alert when the client did not deposit the full amount they committed. They
            will get a portal notification, dashboard banner, and email.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-red-950">Amount still due ($)</span>
              <input
                type="number"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="mt-1 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-red-950">Note to client (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. You committed $10,000 but only $5,000 was received. Please deposit the balance."
                className="mt-1 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </label>
          </div>

          <Button
            size="sm"
            className="mt-4 bg-red-600 hover:bg-red-700"
            disabled={sending || !canSend}
            onClick={() => void send()}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send red deposit alert
          </Button>

          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
