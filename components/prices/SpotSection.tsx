"use client";

import { usePricesStore } from "@/lib/stores/prices-store";
import { MetalCard } from "./MetalCard";

const LAST_SESSION_FOOTNOTE =
  "Last session close (listed market hours are closed; prices refresh when the session opens).";

export function SpotSection() {
  const spotPrices = usePricesStore((state) => state.spotPrices);
  const loading = usePricesStore((state) => state.loading);
  const afterHours = usePricesStore((state) => state.marketSession === "after_hours");

  if (loading && spotPrices.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[184px] animate-pulse rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-elevation)]"
          />
        ))}
      </div>
    );
  }

  if (spotPrices.length === 0) {
    return (
      <div className="rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-background-card)] px-5 py-8 text-center">
        <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Spot cache is empty right now. Prices will appear after the next refresh cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {spotPrices.map((item) => (
        <MetalCard
          key={item.symbol}
          symbol={item.symbol}
          name={item.nameEn}
          price={item.price}
          priceFootnote={afterHours ? LAST_SESSION_FOOTNOTE : undefined}
          change={0}
          changePct={0}
          currency={item.currency}
          href={`/markets/${item.symbol}`}
        />
      ))}
    </div>
  );
}
