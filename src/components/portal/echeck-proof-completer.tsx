"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { DocumentUpload } from "@/components/signup/document-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PendingEcheck {
  id: string;
  amount: number;
  description: string;
  date: string;
  hasFront: boolean;
  hasBack: boolean;
}

export function EcheckProofCompleter() {
  const [items, setItems] = useState<PendingEcheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [frontName, setFrontName] = useState("");
  const [frontPreview, setFrontPreview] = useState("");
  const [backName, setBackName] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio/deposit/pending-proof");
      const data = await res.json();
      if (res.ok) {
        const list = (data.deposits ?? []) as PendingEcheck[];
        setItems(list);
        if (list.length > 0) setActiveId((prev) => prev ?? list[0].id);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const active = items.find((i) => i.id === activeId) ?? items[0] ?? null;

  const submit = async () => {
    if (!active) return;
    if (!frontPreview || !backPreview) {
      setError("Both front and back check screenshots are required");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/portfolio/deposit/${active.id}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofFront: frontPreview,
          proofBack: backPreview,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to upload screenshots");
      setMessage(data.message ?? "Screenshots attached");
      setFrontName("");
      setFrontPreview("");
      setBackName("");
      setBackPreview("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload screenshots");
    } finally {
      setBusy(false);
    }
  };

  if (loading || items.length === 0) return null;

  return (
    <Card className="border-amber-300 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-950">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          eCheck screenshots required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-amber-950/90">
          Your pending eCheck deposit is waiting for clear screenshots of the check (front and
          back). Upload them below so an administrator can review and approve the deposit.
        </p>

        {items.length > 1 && (
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Select deposit</span>
            <select
              className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
              value={active?.id ?? ""}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {items.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatCurrency(d.amount)} · {formatDate(d.date)} · {d.description}
                </option>
              ))}
            </select>
          </label>
        )}

        {active && (
          <p className="text-sm text-slate-700">
            Deposit: <strong>{formatCurrency(active.amount)}</strong> · submitted{" "}
            {formatDate(active.date)}
          </p>
        )}

        <DocumentUpload
          label="Check — Front Side (required)"
          fileName={frontName}
          preview={frontPreview}
          required
          onChange={(file, preview) => {
            setFrontName(file.name);
            setFrontPreview(preview);
            setError(null);
          }}
          onClear={() => {
            setFrontName("");
            setFrontPreview("");
          }}
        />
        <DocumentUpload
          label="Check — Back Side (required)"
          fileName={backName}
          preview={backPreview}
          required
          onChange={(file, preview) => {
            setBackName(file.name);
            setBackPreview(preview);
            setError(null);
          }}
          onClear={() => {
            setBackName("");
            setBackPreview("");
          }}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm font-medium text-emerald-700">{message}</p>}

        <Button
          type="button"
          disabled={busy || !frontPreview || !backPreview}
          onClick={() => void submit()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Submit check screenshots
        </Button>
      </CardContent>
    </Card>
  );
}
