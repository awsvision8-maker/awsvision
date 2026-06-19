"use client";

import { Download, ExternalLink, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCUMENT_FIELDS = [
  { previewKey: "idFrontPreview", nameKey: "idFrontName", label: "ID — Front" },
  { previewKey: "idBackPreview", nameKey: "idBackName", label: "ID — Back" },
  { previewKey: "selfiePreview", nameKey: "selfieName", label: "Selfie Verification" },
] as const;

const HIDDEN_KEYS = new Set<string>([
  ...DOCUMENT_FIELDS.flatMap((d) => [d.previewKey, d.nameKey]),
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

  // Legacy: image stored under name key or generic data URL field
  for (const val of Object.values(kycData)) {
    if (typeof val === "string" && isImageDataUrl(val) && val.includes(previewKey)) {
      return val;
    }
  }
  return direct || null;
}

interface KycDocumentViewerProps {
  kycData: Record<string, string>;
  className?: string;
}

export function KycDocumentViewer({ kycData, className }: KycDocumentViewerProps) {
  const textEntries = Object.entries(kycData).filter(
    ([key, val]) => !HIDDEN_KEYS.has(key) && !(typeof val === "string" && isImageDataUrl(val))
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Identity documents</h3>
        <p className="mt-1 text-xs text-slate-500">
          Review uploaded images and download copies for offline verification.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_FIELDS.map(({ previewKey, nameKey, label }) => {
            const preview = resolvePreview(kycData, previewKey);
            const fileName = kycData[nameKey] || `${label.replace(/\s+/g, "-").toLowerCase()}.jpg`;

            return (
              <div
                key={previewKey}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {label}
                  </p>
                  <p className="truncate text-xs text-slate-500" title={fileName}>
                    {fileName}
                  </p>
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
                    <div className="flex gap-2 border-t border-slate-100 p-2">
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
                  </>
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center gap-2 bg-slate-50 px-4 text-center sm:h-56">
                    <ImageOff className="h-8 w-8 text-slate-300" />
                    <p className="text-xs text-slate-500">
                      {kycData[nameKey]
                        ? "Image file was not stored — ask the client to re-submit documents."
                        : "Not submitted"}
                    </p>
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
    </div>
  );
}
