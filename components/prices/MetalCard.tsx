"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buildMetalSeries, isMetalSymbol } from "@/lib/metals";
import { cn } from "@/lib/cn";
import { toIconLabel } from "@/lib/metals-symbols";
import { useProductSymbolMap } from "@/lib/hooks/useProductSymbolMap";
import type { MetalSymbol } from "@/types/metals";
import Link from "next/link";
import { LivelineChart } from "./LivelineChart";
import { MetalSymbolIcon } from "./MetalSymbolIcon";
import { PriceHintIcon } from "./PriceHintIcon";

export interface MetalCardProps {
  symbol: MetalSymbol | string;
  name: string;
  /** `null` = no live quote (watchlist / optional coverage). */
  price: number | null;
  change: number;
  changePct: number;
  currency: string;
  /** Shown via info icon tooltip next to price (e.g. catalog / last session note). */
  priceFootnote?: string;
  href?: string;
  /** When set, shows a control outside the detail link (e.g. remove from watchlist). */
  onRemoveFromWatchlist?: () => void;
}

function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function formatChangePct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function MetalCard({
  symbol,
  name,
  price,
  change,
  changePct,
  currency,
  priceFootnote,
  href,
  onRemoveFromWatchlist,
}: MetalCardProps) {
  const positive = change >= 0;
  const hasPrice = price != null;
  const referenceOnly = Boolean(priceFootnote);
  const symbolForVisuals = isMetalSymbol(symbol) ? symbol : "XAU";
  const productSymbolMap = useProductSymbolMap();
  const displaySymbol =
    isMetalSymbol(symbol) ? productSymbolMap[symbol] : symbol;
  const chartData = buildMetalSeries(symbolForVisuals, { points: 50, secondsStep: 25 });

  const content = (
    <article
      className="tpmi-card-surface flex flex-col p-5"
      style={{ background: "var(--color-background-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MetalSymbolIcon
              symbol={symbolForVisuals}
              size={32}
              labelOverride={toIconLabel(displaySymbol)}
            />
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0">
                <h3 className="font-title text-[18px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
                  {name}
                </h3>
                <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  {displaySymbol}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="relative shrink-0 overflow-visible text-right font-title text-[20px] font-medium leading-none tracking-[-0.015em] text-[var(--color-text-primary)]">
          {hasPrice ? (
            <>
              <span className="inline-flex items-center justify-end gap-1.5">
                <span>
                  <span className="font-body">{formatPrice(price)}</span>{" "}
                  <span className="font-body text-[12px] font-normal tracking-[-0.01em] text-[var(--color-text-secondary)]">
                    {currency}
                  </span>
                </span>
                {priceFootnote ? (
                  <PriceHintIcon text={priceFootnote} tooltipOnly={Boolean(href)} />
                ) : null}
              </span>
            </>
          ) : (
            <span className="font-body text-[18px] font-normal tracking-[-0.01em] text-[var(--color-text-tertiary)]">
              —
            </span>
          )}
        </p>
      </div>

      <div className="mt-4">
        <LivelineChart
          data={chartData}
          value={price ?? 0}
          height={80}
          compact
          tone={
            !hasPrice || referenceOnly ? "neutral" : positive ? "positive" : "negative"
          }
        />
      </div>
      <div className="mt-3">
        {hasPrice && referenceOnly ? (
          <span className="inline-flex items-center rounded-[999px] bg-[var(--color-background-elevation)] px-2 py-0.5 font-body text-[11px] font-normal tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            Reference only
          </span>
        ) : hasPrice ? (
          <span
            className={`inline-flex items-center rounded-[999px] px-2 py-0.5 font-body text-[11px] font-normal tracking-[-0.01em] ${
              positive
                ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
                : "bg-[var(--color-background-negative-tint)] text-[var(--color-text-negative)]"
            }`}
          >
            {formatChange(change)} · {formatChangePct(changePct)}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-[999px] bg-[var(--color-background-elevation)] px-2 py-0.5 font-body text-[11px] font-normal tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            No live quote
          </span>
        )}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  const linkInner = <Link href={href} className="block">{content}</Link>;

  if (!onRemoveFromWatchlist) {
    return linkInner;
  }

  return (
    <div className="group relative">
      {linkInner}
      <button
        type="button"
        onClick={onRemoveFromWatchlist}
        className={cn(
          "absolute right-0 top-4 z-20 flex h-7 w-7 translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-[var(--color-text-secondary)] shadow-[var(--shadow-1)] outline-none transition-opacity duration-150 hover:bg-[#f2f2f2] hover:text-[var(--color-text-primary)]",
          "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100",
          "focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-border-primary)] focus-visible:ring-offset-2",
        )}
        aria-label={`Remove ${name} from watchlist`}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
