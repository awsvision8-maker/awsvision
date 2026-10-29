"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface DepositProofThumbsProps {
  proofFront?: string | null;
  proofBack?: string | null;
}

export function DepositProofThumbs({ proofFront, proofBack }: DepositProofThumbsProps) {
  const [preview, setPreview] = useState<string | null>(null);

  if (!proofFront && !proofBack) return null;

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
