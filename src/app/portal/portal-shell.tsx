"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Ban, Eye, X } from "lucide-react";
import { PortalSidebar } from "@/components/portal/sidebar";
import { AccountRestrictedOverlay } from "@/components/portal/account-restricted-overlay";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";
import { useInactivityLogout } from "@/lib/use-inactivity-logout";
import { SITE } from "@/lib/site-config";

/** Restricted clients may use Deposit only; lock is hidden on that route. */
function isDepositAllowedPath(pathname: string | null) {
  return Boolean(pathname?.startsWith("/portal/deposit"));
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const {
    user,
    isLoading,
    isAuthenticated,
    isViewOnly,
    adminPreview,
    managerPreview,
    logout,
    exitPortalPreview,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const inPreview = adminPreview || managerPreview;

  useInactivityLogout(logout, isAuthenticated && !isLoading && !inPreview);

  const accountRestricted = Boolean(user?.accountRestricted);
  const depositAllowed = isDepositAllowedPath(pathname);
  // Full lock everywhere except Deposit Funds
  const locked = accountRestricted && !depositAllowed;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Restricted accounts: stay locked (or on deposit) — no KYC redirect
    if (accountRestricted) return;
    // Preview can open dashboard even if KYC is incomplete (view-only)
    if (!isLoading && user && user.kycStatus !== "verified" && !inPreview) {
      router.replace("/kyc");
    }
  }, [isLoading, isAuthenticated, user, router, inPreview, accountRestricted]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (!accountRestricted && user.kycStatus !== "verified" && !inPreview) return null;

  const exitPreview = async () => {
    const result = await exitPortalPreview();
    if (result.mode === "manager") {
      window.location.href = "/manager/clients";
      return;
    }
    if (result.userId) {
      window.location.href = `/admin/users/${result.userId}`;
      return;
    }
    window.location.href = "/admin/users";
  };

  const previewLabel = managerPreview ? "Ambassador view-only" : "Admin view-only";

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-slate-50">
      <div
        className={
          locked
            ? "pointer-events-none flex min-h-screen min-w-0 flex-1 select-none blur-sm"
            : "flex min-h-screen min-w-0 flex-1"
        }
        aria-hidden={locked || undefined}
      >
        <PortalSidebar restrictedDepositOnly={accountRestricted} />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto lg:ml-0">
          {isViewOnly && !locked && (
            <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-amber-950 sm:px-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 shrink-0" />
                <span>
                  {previewLabel} · Viewing{" "}
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  ’s portal — actions disabled
                </span>
              </div>
              <button
                type="button"
                onClick={() => void exitPreview()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Exit preview
              </button>
            </div>
          )}
          {accountRestricted && depositAllowed && (
            <div className="sticky top-0 z-40 border-b border-red-200 bg-red-50 px-4 py-2.5 text-red-950 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Ban className="h-4 w-4 shrink-0" />
                  <span>
                    Account restricted — only <strong>Deposit Funds</strong> is available. Contact{" "}
                    <a
                      href={`mailto:${SITE.email}`}
                      className="underline hover:text-red-800"
                    >
                      {SITE.email}
                    </a>
                  </span>
                </div>
                {!inPreview && (
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="text-xs font-semibold underline hover:text-red-800 cursor-pointer"
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          )}
          {!accountRestricted && <WealthPromoBanner variant="strip" />}
          {children}
          {!isViewOnly && !accountRestricted && <LiveChatWidget />}
        </main>
      </div>
      {locked && (
        <AccountRestrictedOverlay
          previewMode={inPreview}
          onExitPreview={inPreview ? () => void exitPreview() : undefined}
        />
      )}
    </div>
  );
}
