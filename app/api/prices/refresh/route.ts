import { fetchFxRates } from "@/lib/api/fx";
import { fetchAllSpotPrices } from "@/lib/api/goldapi";
import { getSupabaseEnvOrThrow } from "@/lib/supabase/env";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type FxFreshnessRow = { fetched_at: string };

function createServiceRoleClient() {
  const { url } = getSupabaseEnvOrThrow();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceRoleKey);
}

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const errors: string[] = [];

  try {
    const spotRows = await fetchAllSpotPrices();
    const insertPayload = spotRows.map((row) => ({
      symbol: row.symbol,
      price_usd: row.priceUsd,
      fetched_at: row.fetchedAt,
    }));
    const { error } = await supabase.from("spot_cache").insert(insertPayload);
    if (error) errors.push(`spot insert: ${error.message}`);
  } catch (error) {
    errors.push(`spot fetch: ${String(error)}`);
  }

  const { data: lastFxRow, error: lastFxError } = await supabase
    .from("fx_cache")
    .select("fetched_at")
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle<FxFreshnessRow>();

  if (lastFxError) {
    errors.push(`fx last read: ${lastFxError.message}`);
  }

  const lastAgeMinutes = lastFxRow
    ? (Date.now() - new Date(lastFxRow.fetched_at).getTime()) / 1000 / 60
    : Number.POSITIVE_INFINITY;

  if (lastAgeMinutes > 55) {
    try {
      const fx = await fetchFxRates();
      const { error } = await supabase.from("fx_cache").insert({
        base: fx.base,
        rates: fx.rates,
        fetched_at: fx.fetchedAt,
      });
      if (error) errors.push(`fx insert: ${error.message}`);
    } catch (error) {
      errors.push(`fx fetch: ${String(error)}`);
    }
  }

  return NextResponse.json({
    ok: true,
    refreshed_at: new Date().toISOString(),
    errors,
  });
}
