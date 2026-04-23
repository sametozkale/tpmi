"use client";

import { Liveline, type LivelinePoint } from "liveline";
import type { ThemeMode } from "liveline";
import { useSyncExternalStore } from "react";

type ChartTone = "positive" | "negative" | "neutral";

export interface LivelineChartProps {
  data: LivelinePoint[];
  value: number;
  height: number;
  tone?: ChartTone;
  compact?: boolean;
}

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  if (typeof document === "undefined") {
    return "light" as ThemeMode;
  }
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? ("dark" as ThemeMode)
    : ("light" as ThemeMode);
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
}: LivelineChartProps) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribeTheme,
    getThemeSnapshot,
    () => "light",
  );

  return (
    <div
      className="w-full overflow-hidden rounded-[12px] bg-white"
      style={{ height }}
      aria-hidden
    >
      <Liveline
        data={data}
        value={value}
        theme={theme}
        color={colorFromTone(tone)}
        badge={!compact}
        badgeVariant="minimal"
        badgeTail={!compact}
        grid={!compact}
        fill
        pulse={!compact}
        scrub={!compact}
        lineWidth={2}
        exaggerate={compact}
        formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        padding={compact ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined}
      />
    </div>
  );
}
