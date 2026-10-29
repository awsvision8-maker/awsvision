"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DepositProofThumbsProps {
  proofFront?: string | null;
  proofBack?: string | null;
  description?: string;
}

function looksLikeEcheck(description?: string) {
  return Boolean(description && /echeck|e-check|cheque/i.test(description));
}

export function DepositProofThumbs({
  proofFront,
  proofBack,
  description,
}: DepositProofThumbsProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const isEcheck = looksLikeEcheck(description);

  if (!proofFront && !proofBack) {
    if (!isEcheck) return null;
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
        <AlertTriangle className="h-3.5 w-3.5" />
        No cheque screenshots on file — ask client to re-upload on Deposit page
      </p>
    );
  }

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {proofFront && (
          <button
            type="button"
            onClick={() => setPreview(proofFront)}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-pointer hover:ring-2 hover:ring-teal-500/40"
            title="View check front"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proofFront} alt="Check front" className="h-16 w-24 object-cover" />
            <span className="block bg-slate-50 px-1 py-0.5 text-center text-[10px] text-slate-500">
              Front
            </span>
          </button>
        )}
        {proofBack && (
          <button
            type="button"
            onClick={() => setPreview(proofBack)}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-pointer hover:ring-2 hover:ring-teal-500/40"
            title="View check back"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proofBack} alt="Check back" className="h-16 w-24 object-cover" />
            <span className="block bg-slate-50 px-1 py-0.5 text-center text-[10px] text-slate-500">
              Back
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
            alt="Check screenshot"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
