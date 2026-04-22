"use client";

import { LivelineChart } from "@/components/prices/LivelineChart";
import type { LivelinePoint } from "liveline";
import { useEffect, useMemo, useState } from "react";

interface PortfolioInstrument {
  name: string;
  symbol: string;
  price: number;
  quantity: number;
}

function isActiveMarketHours(date: Date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const hour = date.getHours();
  return hour >= 9 && hour < 18;
}

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PortfolioLivePanel({
  instruments,
}: {
  instruments: PortfolioInstrument[];
}) {
  const baseTotal = useMemo(
    () => instruments.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [instruments],
  );
  const [latestValue, setLatestValue] = useState(baseTotal);
  const [series, setSeries] = useState<LivelinePoint[]>(() => {
    const now = Math.floor(Date.now() / 1000);
    return Array.from({ length: 80 }, (_, idx) => ({
      time: now - (79 - idx) * 60,
      value:
        baseTotal +
        Math.sin(idx / 5) * (baseTotal * 0.002) +
        Math.cos(idx / 9) * (baseTotal * 0.0012),
    }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const active = isActiveMarketHours(now);

      setSeries((prev) => {
        const last = prev[prev.length - 1]?.value ?? baseTotal;
        const volatility = active ? 0.0018 : 0.00045;
        const directionalBias = active ? 0.00015 : 0;
        const noise = (Math.random() - 0.5) * baseTotal * volatility;
        const nextValue = Math.max(last + noise + baseTotal * directionalBias, 0);
        const nextPoint = {
          time: Math.floor(now.getTime() / 1000),
          value: nextValue,
        };
        const nextSeries = [...prev.slice(-140), nextPoint];
        setLatestValue(nextValue);
        return nextSeries;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [baseTotal]);

  const firstValue = series[0]?.value ?? latestValue;
  const changeAmount = latestValue - firstValue;
  const changePct = firstValue !== 0 ? (changeAmount / firstValue) * 100 : 0;

  return (
    <section className="space-y-5 rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5 xl:col-span-8">
      <div className="space-y-2">
        <p className="font-body text-[15px] font-normal leading-none tracking-[-0.01em] text-[#777]">
          Portfolio
        </p>
        <p className="font-title text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
          EUR {formatCurrency(latestValue)}
        </p>
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          <span className={changeAmount >= 0 ? "text-[var(--color-text-positive)]" : "text-[var(--color-text-negative)]"}>
            {changeAmount >= 0 ? "↑" : "↓"} {changePct.toFixed(2)}% ({formatCurrency(changeAmount)})
          </span>{" "}
          · {isActiveMarketHours(new Date()) ? "Market open" : "After hours"}
        </p>
      </div>

      <LivelineChart
        data={series}
        value={latestValue}
        height={250}
        tone={changeAmount >= 0 ? "positive" : "negative"}
      />

      <div className="flex items-center gap-4 border-t border-[var(--color-border-primary)] pt-4">
        {["1D", "1W", "1M", "YTD", "1Y", "5Y"].map((range, i) => (
          <button
            key={range}
            type="button"
            className={`font-body text-[11px] tracking-[-0.01em] transition-colors ${
              i === 0
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </section>
  );
}
