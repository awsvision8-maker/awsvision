"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe, Languages } from "lucide-react";
import {
  DEFAULT_SITE_LANGUAGE,
  SITE_LANGUAGES,
  includedLanguagesParam,
  readGoogTransCookie,
  setGoogTransCookie,
  type SiteLanguageCode,
} from "@/lib/site-languages";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: number;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

const SKIP_PREFIXES = ["/admin", "/manager", "/portal"];

function shouldSkip(path: string | null) {
  if (!path) return false;
  return SKIP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function currentLabel(code: SiteLanguageCode) {
  return SITE_LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

type Variant = "header" | "mobile" | "compact";

/**
 * Google Translate–powered language switcher.
 * Default page language is English; selection persists via googtrans cookie.
 */
export function LanguageTranslator({
  variant = "header",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<SiteLanguageCode>(DEFAULT_SITE_LANGUAGE);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const elementId = useId().replace(/:/g, "");

  useEffect(() => {
    setLang(readGoogTransCookie());
  }, []);

  useEffect(() => {
    if (shouldSkip(pathname)) return;

    const init = () => {
      if (!window.google?.translate?.TranslateElement) return;
      const host = document.getElementById(`google_translate_element_${elementId}`);
      if (!host || host.dataset.initialized === "1") {
        setReady(true);
        return;
      }
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: includedLanguagesParam(),
            autoDisplay: false,
          },
          `google_translate_element_${elementId}`
        );
        host.dataset.initialized = "1";
        setReady(true);
      } catch {
        setReady(true);
      }
    };

    window.googleTranslateElementInit = init;

    const existing = document.getElementById("google-translate-script");
    if (existing) {
      if (window.google?.translate?.TranslateElement) init();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      /* keep script for SPA navigations */
    };
  }, [elementId, pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectLang = useCallback(
    (code: SiteLanguageCode) => {
      if (code === lang) {
        setOpen(false);
        return;
      }
      setGoogTransCookie(code);
      setLang(code);
      setOpen(false);
      // Reload so Google Translate applies cleanly from English source
      window.location.reload();
    },
    [lang]
  );

  if (shouldSkip(pathname)) return null;

  const triggerClass =
    variant === "mobile"
      ? "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
      : variant === "compact"
        ? "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-teal-300 hover:text-teal-800"
        : "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-white hover:text-teal-700";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        id={`google_translate_element_${elementId}`}
        className="google-translate-host sr-only"
        aria-hidden
      />

      <button
        type="button"
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${currentLabel(lang)}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="inline-flex items-center gap-1.5">
          {variant === "mobile" ? (
            <Languages className="h-4 w-4 text-teal-600" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          <span>{currentLabel(lang)}</span>
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-70", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className={cn(
            "absolute z-[80] max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl",
            variant === "mobile"
              ? "left-3 right-3 top-full mt-1"
              : "right-0 top-full mt-1.5 w-48"
          )}
        >
          {!ready && (
            <p className="px-3 py-2 text-xs text-slate-500">Loading translator…</p>
          )}
          {SITE_LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === lang}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                item.code === lang
                  ? "bg-teal-50 font-medium text-teal-800"
                  : "text-slate-700 hover:bg-slate-50"
              )}
              onClick={() => selectLang(item.code)}
            >
              <span>{item.label}</span>
              {item.code === lang && <Check className="h-3.5 w-3.5 text-teal-600" />}
            </button>
          ))}
          <p className="border-t border-slate-100 px-3 py-2 text-[10px] leading-snug text-slate-400">
            Default: English. Powered by Google Translate.
          </p>
        </div>
      )}
    </div>
  );
}

/** Compact floating control for pages without the marketing header (login, signup, etc.). */
export function FloatingLanguageTranslator() {
  const pathname = usePathname();
  if (shouldSkip(pathname)) return null;

  const showFloating =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/kyc");

  if (!showFloating) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[65]">
      <LanguageTranslator variant="compact" />
    </div>
  );
}
