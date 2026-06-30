"use client";

import { useState } from "react";
import { Download, ExternalLink, ImageOff, RotateCcw } from "lucide-react";
import {
  documentsForProfileType,
  type KycDocumentKey,
} from "@/lib/kyc-documents";
import { cn } from "@/lib/utils";

const HIDDEN_KEYS = new Set<string>([
  "taxExemptDocPreview",
  "taxExemptDocName",
  "idFrontPreview",
  "idFrontName",
  "idBackPreview",
  "idBackName",
  "selfiePreview",
  "selfieName",
]);

function formatFieldLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function isImageDataUrl(value: string) {
  return value.startsWith("data:image");
}

function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename || "kyc-document.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function resolvePreview(kycData: Record<string, string>, previewKey: string) {
  const direct = kycData[previewKey];
  if (direct && isImageDataUrl(direct)) return direct;
  return direct || null;
}

export interface KycPendingRequest {
  documentKey: string;
  adminNote?: string | null;
}

interface KycDocumentViewerProps {
  kycData: Record<string, string>;
  className?: string;
  userId?: string;
  profileType?: string;
  pendingRequests?: KycPendingRequest[];
  onReuploadRequested?: () => void;
}

export function KycDocumentViewer({
  kycData,
  className,
  userId,
  profileType = "individual",
  pendingRequests = [],
  onReuploadRequested,
}: KycDocumentViewerProps) {
  const [actingKey, setActingKey] = useState<string | null>(null);
  const [modalKey, setModalKey] = useState<KycDocumentKey | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const documentFields = documentsForProfileType(profileType);
  const pendingByKey = new Map(pendingRequests.map((r) => [r.documentKey, r]));

  const textEntries = Object.entries(kycData).filter(
    ([key, val]) => !HIDDEN_KEYS.has(key) && !(typeof val === "string" && isImageDataUrl(val))
  );

  const requestReupload = async (documentKey: KycDocumentKey) => {
    if (!userId) return;
    setActingKey(documentKey);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc/reupload-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentKey, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }
      setModalKey(null);
      setNote("");
      onReuploadRequested?.();
    } finally {
      setActingKey(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Identity documents</h3>
        <p className="mt-1 text-xs text-slate-500">
          Review uploaded images. Request a re-upload if a document is unclear, expired, or incorrect.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentFields.map(({ key, previewKey, nameKey, label }) => {
            const preview = resolvePreview(kycData, previewKey);
            const fileName = kycData[nameKey] || `${label.replace(/\s+/g, "-").toLowerCase()}.jpg`;
            const pending = pendingByKey.get(key);

            return (
              <div
                key={key}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {label}
                      </p>
                      <p className="truncate text-xs text-slate-500" title={fileName}>
                        {fileName}
                      </p>
                    </div>
                    {pending && (
                      <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-800">
                        Re-upload requested
                      </span>
                    )}
                  </div>
                  {pending?.adminNote && (
                    <p className="mt-1 text-xs text-orange-800">Note: {pending.adminNote}</p>
                  )}
                </div>

                {preview && isImageDataUrl(preview) ? (
                  <>
                    <a
                      href={preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={label}
                        className="h-48 w-full object-contain sm:h-56"
                      />
                    </a>
                    <div className="flex flex-col gap-2 border-t border-slate-100 p-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => downloadImage(preview, fileName)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Save image
                        </button>
                        <a
                          href={preview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </a>
                      </div>
                      {userId && !pending && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalKey(key);
                            setNote("");
                            setError(null);
                          }}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800 hover:bg-orange-100 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Request re-upload
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center gap-2 bg-slate-50 px-4 text-center sm:h-56">
                    <ImageOff className="h-8 w-8 text-slate-300" />
                    <p className="text-xs text-slate-500">
                      {kycData[nameKey] ? "Image not stored — request a re-upload." : "Not submitted"}
                    </p>
                    {userId && !pending && (
                      <button
                        type="button"
                        onClick={() => {
                          setModalKey(key);
                          setNote("");
                          setError(null);
                        }}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-100 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Request upload
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {textEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Application details</h3>
          <dl className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            {textEntries.map(([key, val]) => (
              <div key={key}>
                <dt className="text-xs uppercase text-slate-500">{formatFieldLabel(key)}</dt>
                <dd className="mt-0.5 font-medium text-slate-800 break-words">{String(val)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {modalKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-900">Request document re-upload</h4>
            <p className="mt-1 text-sm text-slate-600">
              The user will receive an email and a portal notification with instructions to upload
              this document again.
            </p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Note to client (optional)
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Photo is blurry — please upload a clear, well-lit image."
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalKey(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actingKey === modalKey}
                onClick={() => void requestReupload(modalKey)}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60 cursor-pointer"
              >
                {actingKey === modalKey ? "Sending…" : "Send request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
