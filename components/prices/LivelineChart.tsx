"use client";

import { Liveline, type LivelinePoint } from "liveline";

type ChartTone = "positive" | "negative" | "neutral";

export interface LivelineChartProps {
  data: LivelinePoint[];
  value: number;
  height: number;
  tone?: ChartTone;
  compact?: boolean;
  /** When set, overrides default pulse (normally on when not compact). */
  pulse?: boolean;
  /**
   * How many seconds of history the X-axis spans (Liveline default is 30).
   * Use a large value for portfolio / multi-day series.
   */
  windowSeconds?: number;
}

function colorFromTone(tone: ChartTone) {
  if (tone === "positive") return "var(--color-text-positive)";
  if (tone === "negative") return "var(--color-text-negative)";
  return "var(--color-text-link)";
}

export function LivelineChart({
  data,
  value,
  height,
  tone = "neutral",
  compact = false,
  pulse: pulseProp,
  windowSeconds,
}: LivelineChartProps) {
  const pulse = pulseProp ?? !compact;
  return (
    <div
      className="w-full overflow-hidden rounded-[12px] bg-white"
      style={{ height }}
      aria-hidden
    >
      <Liveline
        data={data}
        value={value}
        window={windowSeconds ?? 30}
        theme="light"
        color={colorFromTone(tone)}
        badge={!compact}
        badgeVariant="minimal"
        badgeTail={!compact}
        grid={!compact}
        fill
        pulse={pulse}
        scrub={!compact}
        lineWidth={2}
        exaggerate={compact}
        formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        padding={compact ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined}
      />
    </div>
  );
}
