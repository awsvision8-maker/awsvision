"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRecaptchaSiteKey, RecaptchaV2 } from "@/components/security/recaptcha-v2";
import { HUMAN_VERIFIED_EVENT } from "@/lib/human-verify-client";

/**
 * One-time (per day) reCAPTCHA gate on marketing pages.
 * Does not block reading the site — only unlocks visit tracking / bot-sensitive features.
 */
export function VisitorHumanGate() {
  const [status, setStatus] = useState<"loading" | "needed" | "verified">("loading");
  const [token, setToken] = useState("");
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/analytics/human", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { verified?: boolean }) => {
        if (cancelled) return;
        if (data.verified) {
          setStatus("verified");
          window.dispatchEvent(new Event(HUMAN_VERIFIED_EVENT));
        } else {
          setStatus("needed");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("needed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(async () => {
    if (getRecaptchaSiteKey() && !token) {
      setError("Please complete the reCAPTCHA checkbox");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/human", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ recaptchaToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      setStatus("verified");
      window.dispatchEvent(new Event(HUMAN_VERIFIED_EVENT));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
      setToken("");
      setRecaptchaKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  }, [token]);

  if (status !== "needed") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Verify you are human</p>
              <p className="mt-0.5 text-xs text-slate-600">
                Complete this check once to continue securely. It helps block bots from flooding
                visits and forms.
              </p>
            </div>
          </div>
          <div className="mt-3">
            <RecaptchaV2 key={recaptchaKey} onChange={setToken} />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          disabled={submitting || (Boolean(getRecaptchaSiteKey()) && !token)}
          onClick={() => void submit()}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </div>
    </div>
  );
}
