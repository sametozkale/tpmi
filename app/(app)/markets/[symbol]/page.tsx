import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { METAL_DETAILS, buildMetalSeries, isMetalSymbol } from "@/lib/metals";
import { LivelineChart } from "@/components/prices/LivelineChart";
import { MetalSymbolIcon } from "@/components/prices/MetalSymbolIcon";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function MetalDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  if (!isMetalSymbol(upperSymbol)) {
    notFound();
  }

  const detail = METAL_DETAILS[upperSymbol];
  const positive = detail.change >= 0;
  const keyStats = [
    { label: "Day High", value: formatNumber(detail.dayHigh) },
    { label: "Day Low", value: formatNumber(detail.dayLow) },
    { label: "Open", value: formatNumber(detail.openPrice) },
    { label: "Prev Close", value: formatNumber(detail.previousClose) },
    { label: "Ask", value: formatNumber(detail.ask) },
    { label: "Bid", value: formatNumber(detail.bid) },
    { label: "52W High", value: formatNumber(detail.week52High) },
    { label: "52W Low", value: formatNumber(detail.week52Low) },
  ];
  const series = buildMetalSeries(detail.symbol, { points: 110, secondsStep: 18 });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-background-card)] px-4 py-2 font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-secondary)] transition-all duration-150 ease-in-out hover:bg-[var(--color-hover-tertiary)] hover:text-[var(--color-text-primary)]"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
          />
          Back to Markets
        </Link>
      </div>

      <section
        className="tpmi-card-surface p-6"
        style={
          detail.symbol === "XAU"
            ? {
                background:
                  "linear-gradient(180deg, var(--color-accent-gold-light), var(--color-background-card))",
              }
            : { background: "var(--color-background-card)" }
        }
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MetalSymbolIcon symbol={detail.symbol} size={32} />
              <div>
                <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
                  {detail.name}
                </h1>
                <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  {detail.symbol} · {detail.unitLabel}
                </p>
              </div>
            </div>
            <p className="max-w-2xl font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
              {detail.tagline}
            </p>
          </div>

          <div className="min-w-[250px] rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] p-4">
            <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
              Spot Price
            </p>
            <p className="mt-1 font-title text-[28px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
              {formatNumber(detail.price)}
            </p>
            <span
              className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 font-body text-[12px] tracking-[-0.01em] ${
                positive
                  ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
                  : "bg-[var(--color-background-negative-tint)] text-[var(--color-text-negative)]"
              }`}
            >
              {formatSigned(detail.change)} · {formatSigned(detail.changePct)}%
            </span>
          </div>
        </div>
      </section>

      <section className="tpmi-card-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-title text-[24px] font-light leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
            Price Activity
          </h2>
          <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            Simulated intraday preview (mock stream in Phase 0)
          </p>
        </div>
        <LivelineChart
          data={series}
          value={detail.price}
          height={220}
          tone={positive ? "positive" : "negative"}
        />
      </section>

      <section className="tpmi-card-surface p-6">
        <h2 className="font-title text-[24px] font-light leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
          Key Levels
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {keyStats.map((item) => (
            <article
              key={item.label}
              className="rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-4 py-3"
            >
              <p className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                {item.label}
              </p>
              <p className="mt-1 font-title text-[20px] font-medium leading-none tracking-[-0.015em] text-[var(--color-text-primary)]">
                {item.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
