"use client";

import { LivelineChart } from "@/components/prices/LivelineChart";
import { isPreciousMetalsLiveSession } from "@/lib/market-hours";
import { isMetalSymbol } from "@/lib/metals";
import { holdingsFromTransactions, type HoldingPosition } from "@/lib/portfolio/from-transactions";
import { portfolioMarkToMarket, type RawSpotMap } from "@/lib/portfolio/mtm-value";
import { usePricesStore } from "@/lib/stores/prices-store";
import type { LivelinePoint } from "liveline";
import type { TransactionRecord } from "@/types/transactions";
import type { Currency, MetalSymbol } from "@/types/metals";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface PortfolioInstrument {
  name: string;
  symbol: string;
  price?: number;
  quantity: number;
}

type RangeKey = "1D" | "1W" | "1M" | "YTD" | "1Y" | "5Y";

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Liveline defaults to a 30s X-axis; portfolio spans days — match the selected range. */
function chartWindowSecondsForRange(range: RangeKey, now: Date): number {
  const spanMs = now.getTime() - rangeStartMs(range, now);
  return Math.max(300, Math.ceil(spanMs / 1000) + 120);
}

function rangeStartMs(range: RangeKey, now: Date): number {
  const t = now.getTime();
  switch (range) {
    case "1D":
      return t - 86400000;
    case "1W":
      return t - 7 * 86400000;
    case "1M":
      return t - 30 * 86400000;
    case "YTD": {
      const d = new Date(now);
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }
    case "1Y":
      return t - 365 * 86400000;
    case "5Y":
      return t - 5 * 365 * 86400000;
    default:
      return t - 86400000;
  }
}

function holdingsAtOrBefore(
  completedAsc: TransactionRecord[],
  atMs: number,
): HoldingPosition[] {
  return holdingsFromTransactions(
    completedAsc.filter((tx) => new Date(tx.executedAt).getTime() <= atMs),
  );
}

function buildTransactionSeries(
  completedAsc: TransactionRecord[],
  range: RangeKey,
  now: Date,
  mtm: (h: HoldingPosition[]) => number,
): LivelinePoint[] {
  const nowMs = now.getTime();
  const tStart = rangeStartMs(range, now);
  const points: LivelinePoint[] = [];

  const push = (tMs: number, value: number) => {
    const sec = Math.floor(tMs / 1000);
    const last = points[points.length - 1];
    if (last && last.time === sec) last.value = value;
    else points.push({ time: sec, value });
  };

  const hStart = holdingsAtOrBefore(completedAsc, tStart);
  push(tStart, mtm(hStart));

  for (const tx of completedAsc) {
    const txMs = new Date(tx.executedAt).getTime();
    if (txMs <= tStart || txMs > nowMs) continue;
    const h = holdingsAtOrBefore(completedAsc, txMs);
    push(txMs, mtm(h));
  }

  const hEnd = holdingsFromTransactions(completedAsc);
  push(nowMs, mtm(hEnd));

  points.sort((a, b) => a.time - b.time);
  return points;
}

function holdingsFromInstrumentsDemo(instruments: PortfolioInstrument[]): HoldingPosition[] {
  return instruments
    .filter((i) => isMetalSymbol(i.symbol as MetalSymbol))
    .map((i) => ({
      symbol: i.symbol as MetalSymbol,
      metalName: i.name,
      quantity: i.quantity,
      costBasis: 0,
    }));
}

export function PortfolioLivePanel({
  transactions: transactionsProp = [],
  instruments = [],
  enableRemoteSync = true,
}: {
  transactions?: TransactionRecord[];
  instruments?: PortfolioInstrument[];
  /** When false, only props drive data (e.g. playground). */
  enableRemoteSync?: boolean;
}) {
  const [txList, setTxList] = useState(transactionsProp);
  const [range, setRange] = useState<RangeKey>("1D");

  const currency = usePricesStore((s) => s.currency) as Currency;
  const marketSession = usePricesStore((s) => s.marketSession);
  const rawSpot = usePricesStore((s) => s.rawSpot);
  const rawFx = usePricesStore((s) => s.rawFx);
  const frozenRawSpot = usePricesStore((s) => s.frozenRawSpot);
  const frozenRawFx = usePricesStore((s) => s.frozenRawFx);

  useEffect(() => {
    setTxList(transactionsProp);
  }, [transactionsProp]);

  useEffect(() => {
    if (!enableRemoteSync) return;
    const tick = () => {
      void fetch("/api/transactions", { method: "GET", cache: "no-store" })
        .then((r) => r.json())
        .then((j: { transactions?: TransactionRecord[] }) => {
          if (Array.isArray(j?.transactions)) setTxList(j.transactions);
        })
        .catch(() => {});
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [enableRemoteSync]);

  const pricing = useMemo(() => {
    const useFrozen =
      marketSession === "after_hours" &&
      frozenRawSpot &&
      Object.keys(frozenRawSpot).length > 0 &&
      frozenRawFx &&
      Object.keys(frozenRawFx).length > 0;
    const spot = (useFrozen ? frozenRawSpot : rawSpot) as RawSpotMap;
    const fx = (useFrozen ? frozenRawFx : rawFx) as Record<string, number>;
    return { spot, fx };
  }, [marketSession, frozenRawSpot, frozenRawFx, rawSpot, rawFx]);

  const completedAsc = useMemo(() => {
    return [...txList]
      .filter((t) => t.status === "completed")
      .sort((a, b) => new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime());
  }, [txList]);

  const mtm = useCallback(
    (h: HoldingPosition[]) => portfolioMarkToMarket(h, pricing.spot, pricing.fx, currency),
    [pricing.spot, pricing.fx, currency],
  );

  const demoHoldings = useMemo(() => holdingsFromInstrumentsDemo(instruments), [instruments]);

  const series = useMemo(() => {
    const now = new Date();
    if (completedAsc.length > 0) {
      return buildTransactionSeries(completedAsc, range, now, mtm);
    }
    if (demoHoldings.length > 0) {
      const v = mtm(demoHoldings);
      const t0 = Math.floor((Date.now() - 3600000) / 1000);
      const t1 = Math.floor(Date.now() / 1000);
      return [
        { time: t0, value: v },
        { time: t1, value: v },
      ];
    }
    const t = Math.floor(Date.now() / 1000);
    return [
      { time: t - 3600, value: 0 },
      { time: t, value: 0 },
    ];
  }, [completedAsc, range, mtm, demoHoldings]);

  const latestValue = series[series.length - 1]?.value ?? 0;
  const firstValue = series[0]?.value ?? latestValue;
  const changeAmount = latestValue - firstValue;
  const changePct = firstValue !== 0 ? (changeAmount / firstValue) * 100 : 0;

  const liveSession = isPreciousMetalsLiveSession(new Date());
  const ranges: RangeKey[] = ["1D", "1W", "1M", "YTD", "1Y", "5Y"];
  const chartWindowSeconds = useMemo(
    () => chartWindowSecondsForRange(range, new Date()),
    [range],
  );

  return (
    <section className="tpmi-card-surface space-y-5 p-5 xl:col-span-8">
      <div className="space-y-2">
        <p className="font-body text-[15px] font-normal leading-none tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Portfolio
        </p>
        <p className="font-title text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
          {currency} {formatCurrency(latestValue)}
        </p>
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
          <span
            className={
              changeAmount >= 0
                ? "text-[var(--color-text-positive)]"
                : "text-[var(--color-text-negative)]"
            }
          >
            {changeAmount >= 0 ? "↑" : "↓"} {changePct.toFixed(2)}% ({formatCurrency(changeAmount)})
          </span>{" "}
          · {liveSession ? "Live session" : "After hours"}
          {completedAsc.length > 0 ? (
            <span className="text-[var(--color-text-tertiary)]"> · Trades + spot (catalog if needed)</span>
          ) : null}
        </p>
      </div>

      <LivelineChart
        data={series}
        value={latestValue}
        height={250}
        tone={changeAmount >= 0 ? "positive" : "negative"}
        pulse={liveSession}
        windowSeconds={chartWindowSeconds}
      />

      <div className="flex flex-wrap items-center gap-2">
        {ranges.map((r) => (
          <button
            key={r}
            type="button"
            className="tpmi-range-chip"
            data-active={range === r}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </section>
  );
}
