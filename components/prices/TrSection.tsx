"use client";

import { usePricesStore } from "@/lib/stores/prices-store";
import { MetalCard } from "./MetalCard";

const TR_DISPLAY_SYMBOLS = ["GRAM", "CEYREK", "YARIM", "TAM", "ATA", "ONS", "GUMUS"] as const;

const LAST_SESSION_FOOTNOTE =
  "Last session close (listed market hours are closed; prices refresh when the session opens).";

export function TrSection() {
  const trPrices = usePricesStore((state) => state.trPrices);
  const loading = usePricesStore((state) => state.loading);
  const afterHours = usePricesStore((state) => state.marketSession === "after_hours");

  const display = trPrices.filter((item) =>
    TR_DISPLAY_SYMBOLS.includes(item.symbol as (typeof TR_DISPLAY_SYMBOLS)[number]),
  );

  if (loading && display.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[184px] animate-pulse rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-elevation)]"
          />
        ))}
      </div>
    );
  }

  if (display.length === 0) {
    return (
      <div className="rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-background-card)] px-5 py-8 text-center">
        <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Turkiye derived prices are not available yet. Waiting for spot and FX cache.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {display.map((item) => (
        <MetalCard
          key={item.symbol}
          symbol={item.symbol}
          name={item.nameTr}
          price={item.price}
          priceFootnote={afterHours ? LAST_SESSION_FOOTNOTE : undefined}
          change={0}
          changePct={0}
          currency={item.currency}
        />
      ))}
    </div>
  );
}
