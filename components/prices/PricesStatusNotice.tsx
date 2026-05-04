"use client";

import { PRECIOUS_METALS_SESSION_TIMEZONE } from "@/lib/market-hours";
import { usePricesStore } from "@/lib/stores/prices-store";

export function PricesStatusNotice() {
  const delayed = usePricesStore((state) => state.delayed);
  const lastFetch = usePricesStore((state) => state.lastFetch);
  const afterHours = usePricesStore((state) => state.marketSession === "after_hours");
  const sessionFrozenAt = usePricesStore((state) => state.sessionFrozenAt);

  if (!delayed && !afterHours) return null;

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-3 py-2">
      {afterHours ? (
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Listed session is closed ({PRECIOUS_METALS_SESSION_TIMEZONE}, weekdays 08:00–17:30). Spot
          and Türkiye-derived cards show the last session snapshot
          {sessionFrozenAt ? ` (frozen ${new Date(sessionFrozenAt).toLocaleString()})` : ""}; live
          updates resume in active hours, within API limits.
        </p>
      ) : null}
      {delayed ? (
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Prices may be delayed. Showing last available cache
          {lastFetch ? ` (${new Date(lastFetch).toLocaleTimeString()})` : ""}.
        </p>
      ) : null}
    </div>
  );
}
