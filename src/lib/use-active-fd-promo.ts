"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActiveFdPromo } from "@/lib/promotions";

interface PromoApiResponse {
  promo: ActiveFdPromo | null;
  offeringOpen?: boolean;
}

/** Client-side active FD promo (null when admin disabled or past endsAt) */
export function useActiveFdPromo() {
  const [promo, setPromo] = useState<ActiveFdPromo | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/promo", { cache: "no-store" });
      const data = (await res.json()) as PromoApiResponse;
      setPromo(res.ok ? data.promo ?? null : null);
    } catch {
      setPromo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { promo, loading, reload };
}
