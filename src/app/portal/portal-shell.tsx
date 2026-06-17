"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PortalSidebar } from "@/components/portal/sidebar";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
      <PortalSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto lg:ml-0">
        <WealthPromoBanner variant="strip" />
        {children}
      </main>
    </div>
  );
}
