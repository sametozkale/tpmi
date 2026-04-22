import type { MetalSymbol } from "@/types/metals";
import type { LivelinePoint } from "liveline";

export interface MetalDetailSnapshot {
  symbol: MetalSymbol;
  name: string;
  tagline: string;
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  openPrice: number;
  previousClose: number;
  ask: number;
  bid: number;
  unitLabel: string;
}

export const METAL_DETAILS: Record<MetalSymbol, MetalDetailSnapshot> = {
  XAU: {
    symbol: "XAU",
    name: "Gold",
    tagline: "Defensive store-of-value benchmark across global markets.",
    price: 2345.67,
    change: 12.3,
    changePct: 0.53,
    dayHigh: 2351.2,
    dayLow: 2332.8,
    week52High: 2451.9,
    week52Low: 1885.4,
    openPrice: 2338.4,
    previousClose: 2333.37,
    ask: 2346.12,
    bid: 2345.33,
    unitLabel: "USD / troy oz",
  },
  XAG: {
    symbol: "XAG",
    name: "Silver",
    tagline: "Hybrid precious and industrial metal with higher volatility.",
    price: 29.84,
    change: -0.21,
    changePct: -0.7,
    dayHigh: 30.12,
    dayLow: 29.62,
    week52High: 32.41,
    week52Low: 21.85,
    openPrice: 30.01,
    previousClose: 30.05,
    ask: 29.88,
    bid: 29.8,
    unitLabel: "USD / troy oz",
  },
  XPT: {
    symbol: "XPT",
    name: "Platinum",
    tagline: "Automotive and industrial demand-sensitive precious metal.",
    price: 978.5,
    change: 5.1,
    changePct: 0.52,
    dayHigh: 984.7,
    dayLow: 968.1,
    week52High: 1123.8,
    week52Low: 843.2,
    openPrice: 973.4,
    previousClose: 973.4,
    ask: 979.12,
    bid: 978.02,
    unitLabel: "USD / troy oz",
  },
  XPD: {
    symbol: "XPD",
    name: "Palladium",
    tagline: "Supply-constrained catalytic metal with cyclical momentum.",
    price: 1024.3,
    change: -8.9,
    changePct: -0.86,
    dayHigh: 1038.5,
    dayLow: 1016.2,
    week52High: 1298.4,
    week52Low: 884.1,
    openPrice: 1030.4,
    previousClose: 1033.2,
    ask: 1025.1,
    bid: 1023.7,
    unitLabel: "USD / troy oz",
  },
};

export const METALS_LIST = Object.values(METAL_DETAILS);

export function isMetalSymbol(value: string): value is MetalSymbol {
  return value === "XAU" || value === "XAG" || value === "XPT" || value === "XPD";
}

export function buildMetalSeries(
  symbol: MetalSymbol,
  opts?: { points?: number; secondsStep?: number },
): LivelinePoint[] {
  const detail = METAL_DETAILS[symbol];
  const points = opts?.points ?? 90;
  const secondsStep = opts?.secondsStep ?? 20;

  const now = Math.floor(Date.now() / 1000);
  const out: LivelinePoint[] = [];
  const waveScale = detail.price * 0.0035;
  const trendScale = detail.change >= 0 ? 1 : -1;

  for (let i = points - 1; i >= 0; i -= 1) {
    const t = now - i * secondsStep;
    const idx = points - i;

    const waveA = Math.sin(idx / 6) * waveScale;
    const waveB = Math.cos(idx / 11) * waveScale * 0.65;
    const drift = trendScale * (idx / points) * (Math.abs(detail.change) * 0.55);
    const jitter = Math.sin(idx * 1.7) * waveScale * 0.05;

    out.push({
      time: t,
      value: detail.price - drift + waveA + waveB + jitter,
    });
  }

  return out;
}
