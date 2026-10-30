"use client";

import { useState } from "react";
import { AlertTriangle, Eye, Loader2, X } from "lucide-react";

interface DepositProofThumbsProps {
  depositId: string;
  description?: string;
  hasProofFront?: boolean;
  hasProofBack?: boolean;
  /** @deprecated inline images — prefer depositId + hasProof flags */
  proofFront?: string | null;
  proofBack?: string | null;
}

function looksLikeEcheck(description?: string) {
  return Boolean(description && /echeck|e-check|cheque/i.test(description));
}

function looksLikePaymentSlip(description?: string) {
  return Boolean(
    description && /ach transfer|wire transfer|zelle/i.test(description)
  );
}

export function DepositProofThumbs({
  depositId,
  description,
  hasProofFront,
  hasProofBack,
  proofFront: inlineFront,
  proofBack: inlineBack,
}: DepositProofThumbsProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [front, setFront] = useState<string | null>(inlineFront ?? null);
  const [back, setBack] = useState<string | null>(inlineBack ?? null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(Boolean(inlineFront || inlineBack));
  const [error, setError] = useState<string | null>(null);

  const isEcheck = looksLikeEcheck(description);
  const isSlip = looksLikePaymentSlip(description);
  const expectsProof = isEcheck || isSlip;
  const frontLabel = isEcheck ? "Front" : "Slip";
  const backLabel = isEcheck ? "Back" : "Extra";
  const viewLabel = isEcheck ? "View cheque screenshots" : "View payment slip";
  const hasAny =
    Boolean(hasProofFront || hasProofBack || front || back || inlineFront || inlineBack);

  const loadProofs = async () => {
    if (loaded || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/deposits/${depositId}/proof`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load screenshots");
      setFront(data.proofFront ?? null);
      setBack(data.proofBack ?? null);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load screenshots");
    } finally {
      setLoading(false);
    }
  };

  if (!hasAny) {
    if (!expectsProof) return null;
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
        <AlertTriangle className="h-3.5 w-3.5" />
        {isEcheck
          ? "No cheque screenshots on file — ask client to re-upload on Deposit page"
          : "No payment slip on file — ask client to re-upload on Deposit page"}
      </p>
    );
  }

  if (!loaded && !front && !back) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={() => void loadProofs()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {loading ? "Loading…" : viewLabel}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {front && (
          <button
            type="button"
            onClick={() => setPreview(front)}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-pointer hover:ring-2 hover:ring-teal-500/40"
            title={`View ${frontLabel.toLowerCase()}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={front} alt={frontLabel} className="h-16 w-24 object-cover" />
            <span className="block bg-slate-50 px-1 py-0.5 text-center text-[10px] text-slate-500">
              {frontLabel}
            </span>
          </button>
        )}
        {back && (
          <button
            type="button"
            onClick={() => setPreview(back)}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-pointer hover:ring-2 hover:ring-teal-500/40"
            title={`View ${backLabel.toLowerCase()}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={back} alt={backLabel} className="h-16 w-24 object-cover" />
            <span className="block bg-slate-50 px-1 py-0.5 text-center text-[10px] text-slate-500">
              {backLabel}
            </span>
          </button>
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-800 cursor-pointer"
            onClick={() => setPreview(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Deposit proof screenshot"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
