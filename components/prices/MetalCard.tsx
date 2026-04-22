import { HugeiconsIcon } from "@hugeicons/react";
import { BarChartIcon, Coins01Icon } from "@hugeicons/core-free-icons";
import { buildMetalSeries } from "@/lib/metals";
import type { MetalSymbol } from "@/types/metals";
import Link from "next/link";
import { LivelineChart } from "./LivelineChart";

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
  const Icon = symbol === "XAU" ? Coins01Icon : BarChartIcon;
  const iconColor =
    symbol === "XAU"
      ? "var(--color-accent-gold)"
      : "var(--color-text-tertiary)";
  const chartData = buildMetalSeries(symbol, { points: 50, secondsStep: 25 });

  const content = (
    <article
      className="flex flex-col rounded-[12px] border border-[var(--color-border-primary)] p-5 shadow-[var(--shadow-0)] transition-shadow duration-150 ease-in-out hover:shadow-[var(--shadow-1)]"
      style={
        symbol === "XAU"
          ? {
              background:
                "linear-gradient(180deg, var(--color-accent-gold-light), var(--color-background-card))",
            }
          : { background: "var(--color-background-card)" }
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <HugeiconsIcon
              icon={Icon}
              size={32}
              color={iconColor}
              strokeWidth={1.5}
            />
            <div>
              <h3 className="font-title text-[18px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
                {name}
              </h3>
              <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                {symbol}
              </p>
            </div>
          </div>
          <p className="font-title text-[20px] font-medium leading-none tracking-[-0.015em] text-[var(--color-text-primary)]">
            {formatPrice(price)}{" "}
            <span className="font-body text-[12px] font-normal tracking-[-0.01em] text-[var(--color-text-secondary)]">
              {currency}
            </span>
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-body text-[12px] font-normal tracking-[-0.01em] ${
            positive
              ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
              : "bg-[var(--color-background-negative-tint)] text-[var(--color-text-negative)]"
          }`}
        >
          {formatChange(change)} · {formatChangePct(changePct)}
        </span>
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
