import { z } from "zod";

export type SpotMetalSymbol = "XAU" | "XAG" | "XPT" | "XPD";

/** Symbols returned by https://api.gold-api.com/symbols that we poll for spot USD. */
export type GoldPriceSymbol = SpotMetalSymbol | "HG";

export interface SpotResult {
  /** API path segment (e.g. HG for copper futures). */
  symbol: GoldPriceSymbol;
  priceUsd: number;
  fetchedAt: string;
}

/** Official base per https://gold-api.com/docs (legacy `gold-api.com/price/*` returns 404). */
const GOLD_API_BASE = "https://api.gold-api.com/price";

const goldApiResponseSchema = z.object({
  price: z.coerce.number().positive(),
});

export async function fetchSpotPrice(symbol: GoldPriceSymbol): Promise<SpotResult> {
  const res = await fetch(`${GOLD_API_BASE}/${symbol}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`api.gold-api.com returned ${res.status} for ${symbol}`);
  }

  const json = await res.json();
  const parsed = goldApiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`api.gold-api.com payload invalid for ${symbol}`);
  }

  return {
    symbol,
    priceUsd: parsed.data.price,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchAllSpotPrices(): Promise<SpotResult[]> {
  const symbols: GoldPriceSymbol[] = ["XAU", "XAG", "XPT", "XPD", "HG"];
  const settled = await Promise.allSettled(symbols.map((symbol) => fetchSpotPrice(symbol)));
  const out: SpotResult[] = [];
  for (let i = 0; i < settled.length; i++) {
    const r = settled[i];
    if (r.status === "fulfilled") out.push(r.value);
  }
  return out;
}
