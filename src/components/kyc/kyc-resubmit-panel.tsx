"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { DocumentUpload } from "@/components/signup/document-upload";
import { SelfieCapture } from "@/components/signup/selfie-capture";
import { Button } from "@/components/ui/button";
import { getKycDocumentDef, type KycDocumentKey } from "@/lib/kyc-documents";

interface KycRequest {
  id: string;
  documentKey: KycDocumentKey;
  documentLabel: string;
  adminNote: string | null;
}

interface KycResubmitPanelProps {
  onSubmitted: () => void;
}

export function KycResubmitPanel({ onSubmitted }: KycResubmitPanelProps) {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { preview: string; fileName: string }>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/kyc/requests");
      const data = await res.json();
      if (res.ok) setRequests(data.requests ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submitDocument = async (documentKey: KycDocumentKey) => {
    const draft = drafts[documentKey];
    if (!draft?.preview || !draft.fileName) {
      setError("Please upload a new document first.");
      return;
    }

    setUploadingKey(documentKey);
    setError(null);
    try {
      const res = await fetch("/api/auth/kyc/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentKey,
          preview: draft.preview,
          fileName: draft.fileName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setSuccessKey(documentKey);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[documentKey];
        return next;
      });
      await load();
      onSubmitted();
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (requests.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 text-left">
      <div className="flex items-start gap-3">
        <Upload className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        <div className="w-full">
          <p className="font-semibold text-orange-950">Document re-upload required</p>
          <p className="mt-1 text-sm text-orange-900/90">
            Our team needs you to submit updated documents below. You will also find this notice in
            your notifications.
          </p>

          <div className="mt-5 space-y-6">
            {requests.map((req) => {
              const def = getKycDocumentDef(req.documentKey);
              const draft = drafts[req.documentKey];
              const isSelfie = req.documentKey === "selfie";

              return (
                <div
                  key={req.id}
                  className="rounded-lg border border-orange-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{req.documentLabel}</p>
                      {req.adminNote && (
                        <p className="mt-1 text-sm text-slate-600">
                          <span className="font-medium text-slate-700">Admin note:</span>{" "}
                          {req.adminNote}
                        </p>
                      )}
                    </div>
                    {successKey === req.documentKey && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Submitted
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {isSelfie ? (
                      <SelfieCapture
                        preview={draft?.preview}
                        fileName={draft?.fileName}
                        onCapture={(file, preview) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [req.documentKey]: { preview, fileName: file.name },
                          }))
                        }
                        onClear={() =>
                          setDrafts((prev) => {
                            const next = { ...prev };
                            delete next[req.documentKey];
                            return next;
                          })
                        }
                        onError={(msg) => setError(msg)}
                      />
                    ) : (
                      <DocumentUpload
                        label={def?.label ?? req.documentLabel}
                        fileName={draft?.fileName}
                        preview={draft?.preview}
                        onChange={(file, preview) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [req.documentKey]: { preview, fileName: file.name },
                          }))
                        }
                        onClear={() =>
                          setDrafts((prev) => {
                            const next = { ...prev };
                            delete next[req.documentKey];
                            return next;
                          })
                        }
                        onError={(msg) => setError(msg)}
                      />
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="mt-4"
                    disabled={!draft?.preview || uploadingKey === req.documentKey}
                    onClick={() => void submitDocument(req.documentKey)}
                  >
                    {uploadingKey === req.documentKey ? "Submitting…" : "Submit updated document"}
                  </Button>
                </div>
              );
            })}
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
