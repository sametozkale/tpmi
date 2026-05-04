import { convertSpotPrice } from "@/lib/api/compute";
import { METAL_DETAILS, isMetalSymbol } from "@/lib/metals";
import type { HoldingPosition } from "@/lib/portfolio/from-transactions";
import type { Currency, MetalSymbol } from "@/types/metals";

type RawSpotRow = { price_usd: number; fetched_at?: string };
export type RawSpotMap = Record<string, RawSpotRow | undefined>;

/** Gold API keys that differ from product symbols (e.g. HG = copper). */
const SPOT_API_KEY: Partial<Record<MetalSymbol, string>> = {
  XAU: "XAU",
  XAG: "XAG",
  XPT: "XPT",
  XPD: "XPD",
  XCU: "HG",
};

export function spotUsdPerOz(rawSpot: RawSpotMap, symbol: MetalSymbol): number {
  const api = SPOT_API_KEY[symbol] ?? symbol;
  const row = rawSpot[api] ?? rawSpot[symbol];
  const usd = row?.price_usd;
  if (typeof usd === "number" && Number.isFinite(usd) && usd > 0) return usd;
  const cat = METAL_DETAILS[symbol]?.price;
  return typeof cat === "number" && Number.isFinite(cat) && cat > 0 ? cat : 0;
}

/** Mark-to-market of open holdings in the given currency using spot rows + FX. */
export function portfolioMarkToMarket(
  holdings: HoldingPosition[],
  rawSpot: RawSpotMap,
  rawFx: Record<string, number>,
  currency: Currency,
): number {
  if (holdings.length === 0) return 0;
  let total = 0;
  for (const h of holdings) {
    if (!isMetalSymbol(h.symbol)) continue;
    const usd = spotUsdPerOz(rawSpot, h.symbol);
    if (!(usd > 0)) continue;
    try {
      total += h.quantity * convertSpotPrice(usd, currency, rawFx);
    } catch {
      total += h.quantity * usd;
    }
  }
  return total;
}
