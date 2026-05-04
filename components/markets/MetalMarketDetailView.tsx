"use client";

import { Button } from "@heroui/react";
import {
  ArrowLeft01Icon,
  FavouriteIcon,
  InformationCircleIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LivelineChart } from "@/components/prices/LivelineChart";
import { MetalSymbolIcon } from "@/components/prices/MetalSymbolIcon";
import { cn } from "@/lib/cn";
import { toIconLabel } from "@/lib/metals-symbols";
import { useProductSymbolMap } from "@/lib/hooks/useProductSymbolMap";
import { buildMetalSeries } from "@/lib/metals";
import type { MetalDetailSnapshot } from "@/lib/metals";
import type { MetalSymbol } from "@/types/metals";

const TIME_RANGES = ["1D", "1W", "1M", "YTD", "1Y", "5Y", "MAX"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const RANGE_OPTS: Record<TimeRange, { points: number; secondsStep: number }> = {
  "1D": { points: 42, secondsStep: 240 },
  "1W": { points: 48, secondsStep: 2100 },
  "1M": { points: 72, secondsStep: 3600 },
  YTD: { points: 84, secondsStep: 7200 },
  "1Y": { points: 96, secondsStep: 14400 },
  "5Y": { points: 108, secondsStep: 43200 },
  MAX: { points: 120, secondsStep: 86400 },
};

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatSigned(value: number, digits = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

function isActiveMarketHours(date: Date) {
  const day = date.getUTCDay();
  const hour = date.getUTCHours();
  if (day === 0 || day === 6) return false;
  return hour >= 13 && hour < 21;
}

function mockHolding(symbol: MetalSymbol, spot: number) {
  const qtyBySymbol: Partial<Record<MetalSymbol, number>> = {
    XAU: 0.52,
    XAG: 14.2,
    XPT: 0.18,
    XPD: 0.22,
    RH: 0.01,
    IR: 0.02,
  };
  const qty = qtyBySymbol[symbol] ?? 0.25;
  const avgBuy = spot * (0.96 + (symbol.charCodeAt(0) % 5) * 0.008);
  const value = qty * spot;
  const cost = qty * avgBuy;
  const gain = value - cost;
  const gainPct = (gain / cost) * 100;
  return { qty, avgBuy, value, gain, gainPct };
}

function mockRecentRows(symbol: MetalSymbol, name: string) {
  return [
    {
      id: "1",
      side: "buy" as const,
      label: `Buy ${name}`,
      meta: "Spot · Market",
      amount: symbol === "XAG" ? 420.12 : 1219.75,
      date: "Apr 23, 2026",
    },
    {
      id: "2",
      side: "sell" as const,
      label: `Sell ${name}`,
      meta: "Limit · Partial",
      amount: 381.95,
      date: "Apr 22, 2026",
    },
    {
      id: "3",
      side: "buy" as const,
      label: `Buy ${name}`,
      meta: "Spot · Accumulation",
      amount: 205.49,
      date: "Apr 18, 2026",
    },
  ];
}

export function MetalMarketDetailView({ detail }: { detail: MetalDetailSnapshot }) {
  const symbolMap = useProductSymbolMap();
  const displaySymbol = symbolMap[detail.symbol] ?? detail.symbol;
  const [range, setRange] = useState<TimeRange>("1M");
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [notes, setNotes] = useState("");

  const positive = detail.change >= 0;
  const series = useMemo(
    () => buildMetalSeries(detail.symbol, RANGE_OPTS[range]),
    [detail.symbol, range],
  );

  const sessionLabel = isActiveMarketHours(new Date()) ? "Market open" : "After hours";
  const changePctLabel = `${formatSigned(detail.changePct)}%`;

  const metricGroups = useMemo(() => {
    const spread = Math.max(0, detail.ask - detail.bid);
    const price = (n: number) => `$${formatNumber(n)}`;
    return [
      {
        id: "today",
        title: "Today's range",
        blurb: "The high and low reached in the current (simulated) session.",
        rows: [
          { label: "Day high", value: price(detail.dayHigh) },
          { label: "Day low", value: price(detail.dayLow) },
        ],
      },
      {
        id: "session",
        title: "Session vs. prior close",
        blurb: "Where the session opened compared with the last official close.",
        rows: [
          { label: "Open", value: price(detail.openPrice) },
          { label: "Previous close", value: price(detail.previousClose) },
        ],
      },
      {
        id: "book",
        title: "Bid & ask",
        blurb: "Top-of-book mock quotes. Spread is indicative, not tradable.",
        rows: [
          { label: "Bid", value: price(detail.bid) },
          { label: "Ask", value: price(detail.ask) },
          { label: "Indicative spread", value: price(spread), muted: true },
        ],
      },
      {
        id: "range52",
        title: "52-week context",
        blurb: "Rolling one-year high and low for quick historical framing.",
        rows: [
          { label: "52-week high", value: price(detail.week52High) },
          { label: "52-week low", value: price(detail.week52Low) },
        ],
      },
    ] as const;
  }, [detail]);

  const holding = mockHolding(detail.symbol, detail.price);
  const recent = mockRecentRows(detail.symbol, detail.name);

  const isGold = detail.symbol === "XAU";
  const heroBackground = isGold
    ? {
        background:
          "linear-gradient(165deg, color-mix(in oklab, var(--color-accent-gold) 16%, white) 0%, var(--color-background-card) 42%, var(--color-background-card) 100%)",
      }
    : {
        background:
          "linear-gradient(180deg, var(--color-background-light-elevation) 0%, var(--color-background-card) 48%)",
      };

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-8">
        <section
          className={cn(
            "tpmi-card-surface relative overflow-hidden p-6 sm:p-8",
            isGold &&
              "shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--color-accent-gold)_45%,transparent)]",
          )}
          style={heroBackground}
        >
          {isGold ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--color-accent-gold)_55%,transparent)] to-transparent"
            />
          ) : null}

          <div className="relative flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/watchlist"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]/90 text-[var(--color-text-secondary)] shadow-[var(--shadow-1)] backdrop-blur-sm transition-colors hover:border-[var(--color-border-active)] hover:text-[var(--color-text-primary)]"
                aria-label="Back to watchlist"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="currentColor" strokeWidth={1.5} />
              </Link>
              <span className="hidden font-body text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-text-quaternary)] sm:inline">
                Spot quote
              </span>
            </div>

            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr),minmax(232px,300px)] md:items-stretch md:gap-10">
              <div className="flex min-w-0 flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <MetalSymbolIcon
                      symbol={detail.symbol}
                      size={44}
                      labelOverride={toIconLabel(displaySymbol)}
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h1 className="font-title text-[28px] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
                      {detail.name}
                    </h1>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-[8px] bg-[#f2f2f2] px-2 py-0.5 font-body text-[12px] font-medium tracking-[-0.01em] text-[#777]">
                        {displaySymbol}
                      </span>
                      <span className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                        {detail.unitLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="max-w-xl font-body text-[14px] leading-relaxed tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  {detail.tagline}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/watchlist"
                    className="inline-flex h-[34px] items-center gap-2 rounded-[12px] bg-[var(--color-background-elevation)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[#777] transition-colors hover:bg-[var(--color-hover-secondary)]"
                  >
                    <HugeiconsIcon icon={FavouriteIcon} size={16} color="currentColor" strokeWidth={1.5} />
                    Watchlist
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-[34px] items-center gap-2 rounded-[12px] bg-[var(--color-background-elevation)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[#777] transition-colors hover:bg-[var(--color-hover-secondary)]"
                  >
                    <HugeiconsIcon icon={Notification01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                    Price alert
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[14px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5 shadow-[var(--shadow-1)] sm:p-6">
                <div>
                  <p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-tertiary)]">
                    Spot
                  </p>
                  <p className="mt-2 font-title text-[32px] font-medium leading-none tracking-[-0.03em] text-[var(--color-text-primary)] tabular-nums">
                    ${formatNumber(detail.price)}
                  </p>
                </div>
                <div className="mt-6 space-y-3 border-t border-[var(--color-border-soft)] pt-4">
                  <p className="font-body text-[13px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-text-tertiary)]">{sessionLabel}</span>
                    <span className="text-[var(--color-text-quaternary)]"> · </span>
                    <span
                      className={
                        positive
                          ? "font-medium text-[var(--color-text-positive)]"
                          : "font-medium text-[var(--color-text-negative)]"
                      }
                    >
                      {formatSigned(detail.change)}
                    </span>
                    <span className="text-[var(--color-text-quaternary)]"> · </span>
                    <span
                      className={
                        positive
                          ? "font-medium text-[var(--color-text-positive)]"
                          : "font-medium text-[var(--color-text-negative)]"
                      }
                    >
                      {changePctLabel}
                    </span>
                  </p>
                  <p className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                    Chart window{" "}
                    <span className="font-medium text-[var(--color-text-secondary)]">{range}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tpmi-card-surface p-5 sm:p-6">
          <div className="relative mb-4">
            <LivelineChart
              data={series}
              value={detail.price}
              height={240}
              tone={positive ? "positive" : "negative"}
            />
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-[var(--color-background-card)] px-2.5 py-1 font-body text-[12px] font-medium tracking-[-0.01em] shadow-sm ring-1 ring-[var(--color-border-primary)]">
              <span className={positive ? "text-[var(--color-text-positive)]" : "text-[var(--color-text-negative)]"}>
                {changePctLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {TIME_RANGES.map((r) => {
                const active = r === range;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`rounded-full px-3 py-1.5 font-body text-[12px] font-medium tracking-[-0.01em] transition-colors ${
                      active
                        ? "bg-[var(--color-button-primary)] text-[var(--color-text-inverted)]"
                        : "bg-[var(--color-background-light-elevation)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <p className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
              Simulated series · Phase 0
            </p>
          </div>
        </section>

        <section className="tpmi-card-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
                Spot metrics
              </h2>
              <p className="max-w-xl font-body text-[13px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                Numbers are grouped by meaning so you can scan the story in a few seconds. All values are Phase 0
                placeholders.
              </p>
            </div>
            <span className="shrink-0 self-start rounded-full border border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-3 py-1 font-body text-[11px] font-medium tracking-[-0.01em] text-[var(--color-text-tertiary)]">
              Mock snapshot
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {metricGroups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col overflow-hidden rounded-[14px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]"
              >
                <div className="flex items-start gap-2 border-b border-[var(--color-border-soft)] bg-[var(--color-background-light-elevation)]/80 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-body text-[13px] font-semibold leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
                      {group.title}
                    </h3>
                    <p className="mt-1 font-body text-[11px] leading-snug tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                      {group.blurb}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[var(--color-text-quaternary)]"
                    title={group.blurb}
                    aria-hidden
                  >
                    <HugeiconsIcon icon={InformationCircleIcon} size={16} color="currentColor" strokeWidth={1.5} />
                  </span>
                </div>
                <dl className="divide-y divide-[var(--color-border-soft)]">
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 px-4 py-3 transition-colors hover:bg-[#f2f2f2]/80"
                    >
                      <dt className="font-body text-[13px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                        {row.label}
                      </dt>
                      <dd
                        className={cn(
                          "shrink-0 text-right font-title text-[17px] font-medium tabular-nums tracking-[-0.02em] text-[var(--color-text-primary)]",
                          "muted" in row && row.muted && "text-[15px] font-normal text-[var(--color-text-tertiary)]",
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className="tpmi-card-surface p-5 sm:p-6">
          <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
            Market context
          </h2>
          <p className="mt-3 font-body text-[14px] leading-relaxed tracking-[-0.01em] text-[var(--color-text-secondary)]">
            {detail.tagline} Figures shown are placeholder data for Phase 0 and do not constitute investment
            advice.
          </p>
        </section>
      </div>

      <aside className="space-y-4 self-start xl:col-span-4">
        <div className="tpmi-card-surface p-5">
          <div className="mb-4 flex rounded-[12px] bg-[var(--color-background-light-elevation)] p-1">
            <button
              type="button"
              onClick={() => setTradeSide("buy")}
              className={`flex-1 rounded-[10px] py-2 text-center font-body text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                tradeSide === "buy"
                  ? "bg-[var(--color-background-card)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setTradeSide("sell")}
              className={`flex-1 rounded-[10px] py-2 text-center font-body text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                tradeSide === "sell"
                  ? "bg-[var(--color-background-card)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="mb-4 rounded-[12px] border border-dashed border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-4 py-7 text-center">
            <label
              htmlFor="order-amount"
              className="mx-auto inline-flex items-center justify-center gap-0.5 rounded-[10px] border border-transparent px-2 py-1.5 transition-colors focus-within:border-[var(--color-border-primary)]"
            >
              <span className="font-title text-[34px] font-medium leading-none tracking-[-0.03em] text-[var(--color-text-tertiary)]">
                $
              </span>
              <input
                id="order-amount"
                type="text"
                inputMode="decimal"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="0"
                className="w-[7ch] min-w-[5ch] bg-transparent text-center font-title text-[38px] font-medium leading-none tracking-[-0.03em] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                aria-label="Order amount"
              />
            </label>
            <p className="mt-1 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
              Enter an amount in Phase 1
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="h-11 w-full rounded-[12px] font-body text-[14px] font-medium tracking-[-0.015em]"
          >
            {tradeSide === "buy" ? "Preview buy" : "Preview sell"}
          </Button>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--color-border-soft)] pt-4 font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            <span>{sessionLabel}</span>
            <span>·</span>
            <span>Fractional oz (mock)</span>
          </div>
        </div>

        <div className="tpmi-card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-title text-[16px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
              Your exposure
            </h3>
            <span className="rounded-full bg-[var(--color-background-light-elevation)] px-2 py-0.5 font-body text-[11px] font-medium tracking-[-0.01em] text-[var(--color-text-secondary)]">
              USD
            </span>
          </div>
          <dl className="space-y-3 font-body text-[13px] tracking-[-0.01em]">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-text-tertiary)]">Market value</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">${formatNumber(holding.value)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-text-tertiary)]">Unrealized P/L</dt>
              <dd
                className={
                  holding.gain >= 0
                    ? "font-medium text-[var(--color-text-positive)]"
                    : "font-medium text-[var(--color-text-negative)]"
                }
              >
                {holding.gain >= 0 ? "+" : ""}${formatNumber(holding.gain)} ({formatSigned(holding.gainPct, 2)}%)
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-text-tertiary)]">Quantity</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">
                {formatNumber(holding.qty, 2)}{" "}
                <span className="font-normal text-[var(--color-text-secondary)]">
                  {detail.unitLabel.replace(/^USD\s*\/\s*/i, "")}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-text-tertiary)]">Avg. buy</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">${formatNumber(holding.avgBuy)}</dd>
            </div>
          </dl>
        </div>

        <div className="tpmi-card-surface p-5">
          <label
            htmlFor="metal-notes"
            className="mb-2 block font-body text-[12px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]"
          >
            Notes
          </label>
          <textarea
            id="metal-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add your market notes here…"
            className="tpmi-input min-h-[96px] resize-y py-2 leading-snug"
          />
        </div>

        <div className="tpmi-card-surface p-5">
          <h3 className="mb-3 font-title text-[16px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
            Recent activity
          </h3>
          <ul className="space-y-3">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-3 border-b border-[var(--color-border-soft)] pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-body text-[13px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                    {row.label}
                  </p>
                  <p className="mt-0.5 font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                    {row.meta} · {row.date}
                  </p>
                </div>
                <p
                  className={`shrink-0 font-body text-[13px] font-medium tracking-[-0.01em] ${
                    row.side === "buy"
                      ? "text-[var(--color-text-negative)]"
                      : "text-[var(--color-text-positive)]"
                  }`}
                >
                  {row.side === "buy" ? "-" : "+"}${formatNumber(row.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
