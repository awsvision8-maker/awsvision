"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PortalSidebar } from "@/components/portal/sidebar";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";
import { useInactivityLogout } from "@/lib/use-inactivity-logout";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useInactivityLogout(logout, isAuthenticated && !isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isLoading && user && user.kycStatus !== "verified") {
      router.replace("/kyc");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user || user.kycStatus !== "verified") return null;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
      <PortalSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto lg:ml-0">
        <WealthPromoBanner variant="strip" />
        {children}
        <LiveChatWidget />
      </main>
    </div>
  );
}
