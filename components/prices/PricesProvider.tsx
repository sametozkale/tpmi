"use client";

import { isPreciousMetalsLiveSession } from "@/lib/market-hours";
import { usePricesStore } from "@/lib/stores/prices-store";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

const LIVE_POLL_MS = 60_000;
const AFTER_HOURS_POLL_MS = 15 * 60_000;
const SESSION_SYNC_MS = 60_000;

export function PricesProvider({ children }: { children: ReactNode }) {
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchPrices = () => usePricesStore.getState().fetchPrices();
    const syncMarketSession = () => usePricesStore.getState().syncMarketSession();

    const clearFetchTimer = () => {
      if (fetchTimerRef.current != null) {
        clearTimeout(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
    };

    const scheduleFetch = () => {
      clearFetchTimer();
      const delay = isPreciousMetalsLiveSession() ? LIVE_POLL_MS : AFTER_HOURS_POLL_MS;
      fetchTimerRef.current = setTimeout(() => {
        void fetchPrices().finally(() => {
          scheduleFetch();
        });
      }, delay);
    };

    void fetchPrices().finally(() => {
      scheduleFetch();
    });

    sessionTimerRef.current = setInterval(() => {
      syncMarketSession();
    }, SESSION_SYNC_MS);

    return () => {
      clearFetchTimer();
      if (sessionTimerRef.current != null) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
