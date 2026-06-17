"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine";

export function usePortfolio() {
  const { user } = useAuth();
  return useMemo(() => buildPortfolioSnapshot(user), [user]);
}
