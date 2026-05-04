"use client";

import { Button, Table } from "@heroui/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { CurrencySelector } from "@/components/prices/CurrencySelector";
import { MetalCard } from "@/components/prices/MetalCard";
import { PriceHintIcon } from "@/components/prices/PriceHintIcon";
import { MetalSymbolIcon } from "@/components/prices/MetalSymbolIcon";
import { toIconLabel } from "@/lib/metals-symbols";
import { useProductSymbolMap } from "@/lib/hooks/useProductSymbolMap";
import { convertSpotPrice } from "@/lib/api/compute";
import { METAL_DETAILS, METALS_LIST } from "@/lib/metals";
import { usePricesStore } from "@/lib/stores/prices-store";
import { useWatchlistFavorites } from "@/lib/stores/watchlist-favorites";
import type { Currency, MetalSymbol } from "@/types/metals";

function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChangePct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function fxRateOk(rates: Record<string, number>, currency: Currency): boolean {
  if (currency === "USD") return true;
  const r = rates[currency];
  return typeof r === "number" && Number.isFinite(r) && r > 0;
}

type WatchlistRow = {
  symbol: MetalSymbol;
  name: string;
  displayPrice: number;
  displayCurrency: string;
  isLive: boolean;
  change: number;
  changePct: number;
};

export function WatchlistView() {
  const rawFavorites = useWatchlistFavorites((s) => s.favorites);
  const addFavorite = useWatchlistFavorites((s) => s.addFavorite);
  const removeFavorite = useWatchlistFavorites((s) => s.removeFavorite);
  const currency = usePricesStore((s) => s.currency);
  const rawFx = usePricesStore((s) => s.rawFx);
  const frozenRawFx = usePricesStore((s) => s.frozenRawFx);
  const frozenRawSpot = usePricesStore((s) => s.frozenRawSpot);
  const marketSession = usePricesStore((s) => s.marketSession);
  const loading = usePricesStore((s) => s.loading);
  const spotPrices = usePricesStore((s) => s.spotPrices);
  const symbolMap = useProductSymbolMap();

  const afterHours = marketSession === "after_hours";
  const effectiveFx = useMemo(() => {
    const useFrozen =
      afterHours &&
      frozenRawSpot &&
      Object.keys(frozenRawSpot).length > 0 &&
      frozenRawFx &&
      Object.keys(frozenRawFx).length > 0;
    return useFrozen ? frozenRawFx : rawFx;
  }, [afterHours, frozenRawSpot, frozenRawFx, rawFx]);

  const hasFx = Object.keys(effectiveFx).length > 0;
  const awaitingFirstFetch = loading && !hasFx;

  const apiMetals = useMemo((): WatchlistRow[] => {
    const liveBySymbol = new Map(
      spotPrices.map((p) => [p.symbol as MetalSymbol, p]),
    );
    const cur = currency;

    return METALS_LIST.map((detail) => {
      const catalog = METAL_DETAILS[detail.symbol];
      const q = liveBySymbol.get(detail.symbol);
      const hasLive = q != null && Number.isFinite(q.price) && q.price > 0;

      let displayPrice = Number.isFinite(catalog.price) ? catalog.price : 0;
      let displayCurrency: string = cur;

      if (hasLive && q) {
        displayPrice = q.price;
      } else if (fxRateOk(effectiveFx, cur)) {
        try {
          displayPrice = convertSpotPrice(catalog.price, cur, effectiveFx);
        } catch {
          displayPrice = catalog.price;
          displayCurrency = "USD";
        }
      } else {
        displayPrice = catalog.price;
        displayCurrency = "USD";
      }

      if (!Number.isFinite(displayPrice)) displayPrice = 0;

      return {
        symbol: detail.symbol,
        name: detail.name,
        displayPrice,
        displayCurrency,
        isLive: hasLive,
        change: 0,
        changePct: 0,
      };
    });
  }, [spotPrices, currency, effectiveFx]);

  const favorites = useMemo(
    () =>
      rawFavorites.filter((sym): sym is MetalSymbol =>
        apiMetals.some((m) => m.symbol === sym),
      ),
    [rawFavorites, apiMetals],
  );

  const favoriteMetals = useMemo(
    () => apiMetals.filter((m) => favorites.includes(m.symbol)),
    [apiMetals, favorites],
  );

  const tableMetals = useMemo(
    () => apiMetals.filter((m) => !favorites.includes(m.symbol)),
    [apiMetals, favorites],
  );

  const catalogFootnote = "Catalog estimate (not live spot)";
  const lastSessionFootnote =
    "Last session close (listed market hours are closed; live ticks resume when the session opens).";

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Watchlist
          </h1>
          <p className="max-w-xl font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Live spot when the session is open; last close outside hours. Unsupported metals use catalog prices with FX
            (or USD).
          </p>
        </div>
        <div className="flex justify-end">
          <CurrencySelector />
        </div>
      </header>

      <section aria-label="My favorites" className="space-y-4">
        <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
          My favorites
        </h2>
        {favoriteMetals.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-background-card)] px-5 py-10 text-center">
            <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
              No favorites yet. Use &quot;Favorite&quot; in the table below to add metals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteMetals.map((m) => (
              <MetalCard
                key={m.symbol}
                symbol={m.symbol}
                name={m.name}
                price={m.displayPrice}
                priceFootnote={
                  m.isLive ? (afterHours ? lastSessionFootnote : undefined) : catalogFootnote
                }
                change={m.change}
                changePct={m.changePct}
                currency={m.displayCurrency}
                href={`/markets/${m.symbol}`}
                onRemoveFromWatchlist={() => removeFavorite(m.symbol)}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-label="All metals" className="space-y-4">
        <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
          All metals
        </h2>
        <div className="overflow-x-auto">
          {awaitingFirstFetch ? (
            <div className="rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-background-card)] px-5 py-8 text-center">
              <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                Waiting for FX rates…
              </p>
            </div>
          ) : tableMetals.length === 0 ? (
            <div className="rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-background-card)] px-5 py-8 text-center">
              <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                Every metal is in your favorites. Remove one from a card above to show it in this list again.
              </p>
            </div>
          ) : (
            <Table
              aria-label="Metals to add to watchlist"
              className="min-w-[720px] overflow-hidden rounded-b-[14px]"
            >
              <Table.Content className="-mb-1 w-full min-w-[720px] border-separate border-spacing-y-1">
                <Table.Header className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                  <Table.Column isRowHeader className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                    Metal
                  </Table.Column>
                  <Table.Column className="h-auto bg-transparent px-3 py-1 text-right font-normal">
                    Price
                  </Table.Column>
                  <Table.Column className="h-auto bg-transparent px-3 py-1 text-right font-normal">
                    Change
                  </Table.Column>
                  <Table.Column className="h-auto bg-transparent px-3 py-1 text-right font-normal">
                    {" "}
                  </Table.Column>
                </Table.Header>
                <Table.Body className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)]">
                  {tableMetals.map((m) => {
                    const positive = m.changePct >= 0;
                    return (
                      <Table.Row key={m.symbol}>
                        <Table.Cell className="rounded-l-[12px] bg-white px-3 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <MetalSymbolIcon
                              symbol={m.symbol}
                              size={28}
                              labelOverride={toIconLabel(symbolMap[m.symbol] ?? m.symbol)}
                            />
                            <div>
                              <p className="font-medium">{m.name}</p>
                              <p className="text-[11px] text-[var(--color-text-secondary)]">
                                {symbolMap[m.symbol] ?? m.symbol}
                              </p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="relative overflow-visible bg-white px-3 py-3 align-middle text-right tabular-nums">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="inline-flex items-center justify-end gap-1.5">
                              <span>
                                {formatPrice(m.displayPrice)} {m.displayCurrency}
                              </span>
                              {!m.isLive ? (
                                <PriceHintIcon text={catalogFootnote} />
                              ) : afterHours ? (
                                <PriceHintIcon text={lastSessionFootnote} />
                              ) : null}
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell
                          className={`bg-white px-3 py-3 align-middle text-right tabular-nums ${
                            !m.isLive
                              ? "text-[var(--color-text-tertiary)]"
                              : positive
                                ? "text-[var(--color-text-positive)]"
                                : "text-[var(--color-text-negative)]"
                          }`}
                        >
                          {m.isLive ? formatChangePct(m.changePct) : "—"}
                        </Table.Cell>
                        <Table.Cell className="rounded-r-[12px] bg-white px-3 py-3 align-middle text-right">
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-8 rounded-[10px] border border-[var(--color-border-soft)] bg-white px-3 font-body text-[13px] font-medium tracking-[-0.01em] hover:bg-[#f8f8f8]"
                            onPress={() => addFavorite(m.symbol)}
                          >
                            <span className="inline-flex items-center gap-1">
                              <HugeiconsIcon icon={FavouriteIcon} size={16} strokeWidth={1.6} />
                              Favorite
                            </span>
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Content>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
