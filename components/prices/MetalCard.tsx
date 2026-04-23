import { buildMetalSeries } from "@/lib/metals";
import type { MetalSymbol } from "@/types/metals";
import Link from "next/link";
import { LivelineChart } from "./LivelineChart";
import { MetalSymbolIcon } from "./MetalSymbolIcon";

export interface MetalCardProps {
  symbol: MetalSymbol;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
  href?: string;
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
  href,
}: MetalCardProps) {
  const positive = change >= 0;
  const chartData = buildMetalSeries(symbol, { points: 50, secondsStep: 25 });

  const content = (
    <article
      className="tpmi-card-surface flex flex-col p-5"
      style={{ background: "var(--color-background-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MetalSymbolIcon symbol={symbol} size={32} />
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="font-title text-[18px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
                    {name}
                  </h3>
                  <span
                    className={`hidden shrink-0 items-center rounded-[999px] px-2 py-0.5 font-body text-[11px] font-normal tracking-[-0.01em] 2xl:inline-flex ${
                      positive
                        ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
                        : "bg-[var(--color-background-negative-tint)] text-[var(--color-text-negative)]"
                    }`}
                  >
                    {formatChange(change)} · {formatChangePct(changePct)}
                  </span>
                </div>
                <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  {symbol}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="shrink-0 text-right font-title text-[20px] font-medium leading-none tracking-[-0.015em] text-[var(--color-text-primary)]">
          <span className="font-body">{formatPrice(price)}</span>{" "}
          <span className="font-body text-[12px] font-normal tracking-[-0.01em] text-[var(--color-text-secondary)]">
            {currency}
          </span>
        </p>
      </div>

      <div className="mt-4">
        <LivelineChart
          data={chartData}
          value={price}
          height={80}
          compact
          tone={positive ? "positive" : "negative"}
        />
      </div>
      <div className="mt-3 2xl:hidden">
        <span
          className={`inline-flex items-center rounded-[999px] px-2 py-0.5 font-body text-[11px] font-normal tracking-[-0.01em] ${
            positive
              ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
              : "bg-[var(--color-background-negative-tint)] text-[var(--color-text-negative)]"
          }`}
        >
          {formatChange(change)} · {formatChangePct(changePct)}
        </span>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
