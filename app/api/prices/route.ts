import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { fetchFxRates } from "@/lib/api/fx";
import { fetchAllSpotPrices } from "@/lib/api/goldapi";
import { NextResponse } from "next/server";

type SpotRow = {
  symbol: string;
  price_usd: number;
  fetched_at: string;
};

type FxRow = {
  rates: Record<string, number>;
  fetched_at: string;
};

export async function GET() {
  const latestBySymbol: Record<string, { price_usd: number; fetched_at: string }> = {};
  let fxRow: FxRow | null = null;

  /** Cache read failures must not block live fallback (local dev, missing tables, RLS, etc.). */
  if (getSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data: spotRows, error: spotError } = await supabase
        .from("spot_cache")
        .select("symbol, price_usd, fetched_at")
        .order("fetched_at", { ascending: false })
        .limit(64);

      if (spotError) {
        console.warn("[api/prices] spot_cache read failed:", spotError.message);
      } else {
        for (const row of (spotRows ?? []) as SpotRow[]) {
          if (!latestBySymbol[row.symbol]) {
            latestBySymbol[row.symbol] = {
              price_usd: row.price_usd,
              fetched_at: row.fetched_at,
            };
          }
        }
      }

      const { data: fxData, error: fxError } = await supabase
        .from("fx_cache")
        .select("rates, fetched_at")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .maybeSingle<FxRow>();

      if (fxError) {
        console.warn("[api/prices] fx_cache read failed:", fxError.message);
      } else {
        fxRow = fxData ?? null;
      }
    } catch (e) {
      console.warn("[api/prices] Supabase unavailable:", e);
    }
  }

  const hasSpotCache = Object.keys(latestBySymbol).length > 0;
  const hasFxCache = !!fxRow?.rates && Object.keys(fxRow.rates).length > 0;

  if (hasSpotCache && hasFxCache) {
    return NextResponse.json({
      spot: latestBySymbol,
      fx: fxRow?.rates ?? {},
      fx_fetched_at: fxRow?.fetched_at ?? null,
      cached_at: new Date().toISOString(),
      source: "cache",
    });
  }

  // Fallback: if cache is empty (e.g. first run before cron), fetch live.
  let liveSpot: Record<string, { price_usd: number; fetched_at: string }> = latestBySymbol;
  let liveFx: Record<string, number> = fxRow?.rates ?? {};

  if (!hasSpotCache) {
    try {
      const spots = await fetchAllSpotPrices();
      liveSpot = spots.reduce<Record<string, { price_usd: number; fetched_at: string }>>(
        (acc, row) => {
          acc[row.symbol] = { price_usd: row.priceUsd, fetched_at: row.fetchedAt };
          return acc;
        },
        {},
      );
    } catch {
      // Keep whatever cache we had.
    }
  }

  if (!hasFxCache) {
    try {
      const fx = await fetchFxRates();
      liveFx = fx.rates;
    } catch {
      // Keep whatever cache we had.
    }
  }

  return NextResponse.json({
    spot: liveSpot,
    fx: liveFx,
    fx_fetched_at: fxRow?.fetched_at ?? null,
    cached_at: new Date().toISOString(),
    source: hasSpotCache || hasFxCache ? "cache+live-fallback" : "live-fallback",
  });
}
