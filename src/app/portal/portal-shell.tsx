"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Eye, X } from "lucide-react";
import { PortalSidebar } from "@/components/portal/sidebar";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";
import { useInactivityLogout } from "@/lib/use-inactivity-logout";

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
  const inPreview = adminPreview || managerPreview;

  useInactivityLogout(logout, isAuthenticated && !isLoading && !inPreview);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Preview can open dashboard even if KYC is incomplete (view-only)
    if (!isLoading && user && user.kycStatus !== "verified" && !inPreview) {
      router.replace("/kyc");
    }
  }, [isLoading, isAuthenticated, user, router, inPreview]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (user.kycStatus !== "verified" && !inPreview) return null;

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
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
      <PortalSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto lg:ml-0">
        {isViewOnly && (
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
        <WealthPromoBanner variant="strip" />
        {children}
        {!isViewOnly && <LiveChatWidget />}
      </main>
    </div>
  );
}
