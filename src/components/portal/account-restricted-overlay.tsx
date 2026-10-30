"use client";

import { Ban, Mail } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { useAuth } from "@/lib/auth-context";

/**
 * Non-dismissible full-portal lock when admin has restricted the account.
 * Blurs the dashboard behind; only support contact (and sign out) remain.
 */
export function AccountRestrictedOverlay() {
  const { user, logout } = useAuth();

  if (!user?.accountRestricted) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="account-restricted-title"
      aria-describedby="account-restricted-desc"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <Ban className="h-7 w-7 text-red-600" />
        </div>
        <h1
          id="account-restricted-title"
          className="mt-5 text-center text-xl font-bold text-slate-900"
        >
          Account restricted
        </h1>
        <p
          id="account-restricted-desc"
          className="mt-3 text-center text-sm leading-relaxed text-slate-600"
        >
          Your AWS Vision account has been restricted. You cannot access portal features while this
          status is active. Please contact support for assistance.
        </p>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent("Account restricted — support request")}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Mail className="h-4 w-4" />
          Contact support — {SITE.email}
        </a>
        <p className="mt-3 text-center text-xs text-slate-500">{SITE.email}</p>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-6 w-full text-center text-sm font-medium text-slate-500 underline hover:text-slate-800 cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
