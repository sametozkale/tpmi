import { buildSpotPrices, buildTrPrices, type ComputedPrice } from "@/lib/api/compute";
import type { SpotMetalSymbol } from "@/lib/api/goldapi";
import { isPreciousMetalsLiveSession } from "@/lib/market-hours";
import type { Currency } from "@/types/metals";
import { create } from "zustand";

type RawSpot = Record<string, { price_usd: number; fetched_at: string }>;

export type MarketSession = "live" | "after_hours";

interface PricesState {
  rawSpot: RawSpot;
  rawFx: Record<string, number>;
  currency: Currency;
  loading: boolean;
  delayed: boolean;
  lastFetch: string | null;
  marketSession: MarketSession;
  /** Snapshot of API rows when the listed session closed; drives display until the next open. */
  frozenRawSpot: RawSpot | null;
  frozenRawFx: Record<string, number> | null;
  sessionFrozenAt: string | null;
  spotPrices: ComputedPrice[];
  trPrices: ComputedPrice[];
  setCurrency: (currency: Currency) => void;
  recompute: () => void;
  syncMarketSession: () => void;
  fetchPrices: () => Promise<void>;
}

function toSpotMap(rawSpot: RawSpot): Record<SpotMetalSymbol, number> {
  return {
    XAU: rawSpot.XAU?.price_usd ?? 0,
    XAG: rawSpot.XAG?.price_usd ?? 0,
    XPT: rawSpot.XPT?.price_usd ?? 0,
    XPD: rawSpot.XPD?.price_usd ?? 0,
  };
}

function fxRateOk(rates: Record<string, number>, currency: Currency): boolean {
  if (currency === "USD") return true;
  const r = rates[currency];
  return typeof r === "number" && Number.isFinite(r) && r > 0;
}

function hasFrozenSpot(frozen: RawSpot | null): boolean {
  return Boolean(frozen && Object.keys(frozen).length > 0);
}

export const usePricesStore = create<PricesState>((set, get) => ({
  rawSpot: {},
  rawFx: {},
  currency: "EUR",
  loading: false,
  delayed: false,
  lastFetch: null,
  marketSession: "live",
  frozenRawSpot: null,
  frozenRawFx: null,
  sessionFrozenAt: null,
  spotPrices: [],
  trPrices: [],
  setCurrency: (currency) => {
    set({ currency });
    get().recompute();
  },
  syncMarketSession: () => {
    const live = isPreciousMetalsLiveSession();
    const { rawSpot, rawFx, frozenRawSpot } = get();

    if (live) {
      set({
        marketSession: "live",
        frozenRawSpot: null,
        frozenRawFx: null,
        sessionFrozenAt: null,
      });
      get().recompute();
      return;
    }

    const rawKeys = Object.keys(rawSpot);
    if (rawKeys.length > 0 && !hasFrozenSpot(frozenRawSpot)) {
      set({
        marketSession: "after_hours",
        frozenRawSpot: structuredClone(rawSpot),
        frozenRawFx: { ...rawFx },
        sessionFrozenAt: new Date().toISOString(),
      });
    } else {
      set({ marketSession: "after_hours" });
    }
    get().recompute();
  },
  recompute: () => {
    const { rawSpot, rawFx, currency, marketSession, frozenRawSpot, frozenRawFx } = get();
    const useFrozen =
      marketSession === "after_hours" && hasFrozenSpot(frozenRawSpot) && frozenRawSpot;
    const srcSpot = useFrozen ? frozenRawSpot : rawSpot;
    const srcFx =
      useFrozen && frozenRawFx && Object.keys(frozenRawFx).length > 0 ? frozenRawFx : rawFx;

    const spot = toSpotMap(srcSpot);
    const hasAnySpot = Object.keys(srcSpot).length > 0;

    let spotPrices: ComputedPrice[] = [];
    if (hasAnySpot && fxRateOk(srcFx, currency)) {
      try {
        spotPrices = buildSpotPrices(srcSpot, currency, srcFx);
      } catch {
        spotPrices = [];
      }
    }

    let trPrices: ComputedPrice[] = [];
    const tryOk =
      typeof srcFx.TRY === "number" &&
      Number.isFinite(srcFx.TRY) &&
      srcFx.TRY > 0 &&
      spot.XAU > 0 &&
      spot.XAG > 0;
    if (tryOk) {
      try {
        trPrices = buildTrPrices(spot.XAU, spot.XAG, srcFx);
      } catch {
        trPrices = [];
      }
    }

    set({ spotPrices, trPrices });
  },
  fetchPrices: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/prices", { method: "GET" });
      const json = (await res.json().catch(() => null)) as
        | {
            spot?: RawSpot;
            fx?: Record<string, number>;
            cached_at?: string;
          }
        | null;

      if (!res.ok || !json) {
        set({ loading: false, delayed: true });
        get().syncMarketSession();
        return;
      }

      set({
        rawSpot: json.spot ?? {},
        rawFx: json.fx ?? {},
        lastFetch: json.cached_at ?? null,
        loading: false,
        delayed: false,
      });
      get().syncMarketSession();
    } catch {
      set({ loading: false, delayed: true });
      get().syncMarketSession();
    }
  },
}));
