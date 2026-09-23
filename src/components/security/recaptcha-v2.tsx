"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (cb: () => void) => void;
    };
    __awsvisionRecaptchaReady?: boolean;
    __awsvisionRecaptchaQueue?: Array<() => void>;
  }
}

function onRecaptchaApiLoad() {
  window.__awsvisionRecaptchaReady = true;
  const queue = window.__awsvisionRecaptchaQueue ?? [];
  window.__awsvisionRecaptchaQueue = [];
  queue.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  (window as Window & { onAwsvisionRecaptchaLoad?: () => void }).onAwsvisionRecaptchaLoad =
    onRecaptchaApiLoad;
}

export function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";
}

export function RecaptchaV2({
  onChange,
  theme = "light",
  className,
}: {
  onChange: (token: string) => void;
  theme?: "light" | "dark";
  className?: string;
}) {
  const siteKey = getRecaptchaSiteKey();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const [scriptReady, setScriptReady] = useState(false);
  const uid = useId();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.grecaptcha) return;
    if (widgetIdRef.current !== null) return;

    widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => onChangeRef.current(token),
      "expired-callback": () => onChangeRef.current(""),
      "error-callback": () => onChangeRef.current(""),
    });
  }, [siteKey, theme]);

  useEffect(() => {
    if (!siteKey) return;

    const run = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
    };

    if (window.__awsvisionRecaptchaReady && window.grecaptcha) {
      run();
      return;
    }

    window.__awsvisionRecaptchaQueue = window.__awsvisionRecaptchaQueue ?? [];
    window.__awsvisionRecaptchaQueue.push(run);
  }, [siteKey, renderWidget, scriptReady]);

  if (!siteKey) {
    if (process.env.NODE_ENV === "production") {
      return (
        <p className="text-sm text-amber-700">
          Security check is not configured. Please contact support if this persists.
        </p>
      );
    }
    return (
      <p className="text-xs text-slate-500">
        Dev mode: reCAPTCHA skipped (set NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
      </p>
    );
  }

  return (
    <div className={className}>
      <Script
        id="google-recaptcha-v2"
        src="https://www.google.com/recaptcha/api.js?onload=onAwsvisionRecaptchaLoad&render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          onRecaptchaApiLoad();
          setScriptReady(true);
        }}
      />
      <div ref={containerRef} data-recaptcha={uid} />
      <p className="mt-1.5 text-[11px] text-slate-500">
        Protected by Google reCAPTCHA.{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-700"
        >
          Privacy
        </a>{" "}
        ·{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-700"
        >
          Terms
        </a>
      </p>
    </div>
  );
}
