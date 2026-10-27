/** Site translator languages. Source/default is always English. */
export const SITE_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "zh-CN", label: "中文" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिन्दी" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
] as const;

export type SiteLanguageCode = (typeof SITE_LANGUAGES)[number]["code"];

export const DEFAULT_SITE_LANGUAGE: SiteLanguageCode = "en";

export function includedLanguagesParam() {
  return SITE_LANGUAGES.map((l) => l.code).join(",");
}

export function readGoogTransCookie(): SiteLanguageCode {
  if (typeof document === "undefined") return DEFAULT_SITE_LANGUAGE;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match?.[1]) return DEFAULT_SITE_LANGUAGE;
  const value = decodeURIComponent(match[1]);
  // formats: /en/es or /auto/es
  const parts = value.split("/").filter(Boolean);
  const target = parts[parts.length - 1] as SiteLanguageCode | undefined;
  if (target && SITE_LANGUAGES.some((l) => l.code === target)) return target;
  return DEFAULT_SITE_LANGUAGE;
}

export function setGoogTransCookie(lang: SiteLanguageCode) {
  const domains = [window.location.hostname, `.${window.location.hostname}`];
  if (lang === DEFAULT_SITE_LANGUAGE) {
    // Clear cookie on current + parent-style hostnames
    for (const domain of domains) {
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
    }
    document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    return;
  }
  document.cookie = `googtrans=/en/${lang};path=/`;
}
