import type { Currency, MetalSymbol } from "@/types/metals";

type RawSpotRow = { price_usd: number; fetched_at: string };
type RawSpot = Record<string, RawSpotRow>;

/** Live USD rows from Gold API: `apiKey` is the path symbol (HG = copper). */
const LIVE_SPOT_ROWS: ReadonlyArray<{
  symbol: MetalSymbol;
  apiKey: string;
  nameEn: string;
  nameTr: string;
}> = [
  { symbol: "XAU", apiKey: "XAU", nameEn: "Gold", nameTr: "Altin" },
  { symbol: "XAG", apiKey: "XAG", nameEn: "Silver", nameTr: "Gumus" },
  { symbol: "XPT", apiKey: "XPT", nameEn: "Platinum", nameTr: "Platin" },
  { symbol: "XPD", apiKey: "XPD", nameEn: "Palladium", nameTr: "Paladyum" },
  { symbol: "XCU", apiKey: "HG", nameEn: "Copper", nameTr: "Bakir" },
];

const TROY_OZ_TO_GRAM = 31.1035;

const TR_WEIGHTS = {
  CEYREK: 1.75,
  YARIM: 3.5,
  TAM: 7.0,
  ATA: 6.6,
} as const;

export type TrComputedSymbol = "GRAM" | "CEYREK" | "YARIM" | "TAM" | "ATA" | "ONS" | "GUMUS";

export interface ComputedPrice {
  symbol: string;
  nameEn: string;
  nameTr: string;
  price: number;
  currency: Currency | "TRY";
}

function mustRate(rates: Record<string, number>, currency: string): number {
  if (currency === "USD") return 1;
  const rate = rates[currency];
  if (!rate) throw new Error(`Missing FX rate for ${currency}`);
  return rate;
}

export function convertSpotPrice(
  priceUsd: number,
  targetCurrency: Currency,
  rates: Record<string, number>,
): number {
  return priceUsd * mustRate(rates, targetCurrency);
}

export function buildSpotPrices(
  rawSpot: RawSpot,
  targetCurrency: Currency,
  rates: Record<string, number>,
): ComputedPrice[] {
  return LIVE_SPOT_ROWS.map((row) => {
    const usd = rawSpot[row.apiKey]?.price_usd ?? 0;
    return {
      symbol: row.symbol,
      nameEn: row.nameEn,
      nameTr: row.nameTr,
      price: convertSpotPrice(usd, targetCurrency, rates),
      currency: targetCurrency,
    };
  });
}

export function buildTrPrices(
  xauUsd: number,
  xagUsd: number,
  rates: Record<string, number>,
): ComputedPrice[] {
  const usdTry = mustRate(rates, "TRY");
  const gramAltin = (xauUsd / TROY_OZ_TO_GRAM) * usdTry;
  const gramGumus = (xagUsd / TROY_OZ_TO_GRAM) * usdTry;
  const onsTry = xauUsd * usdTry;

  const prices: Array<{ symbol: TrComputedSymbol; nameEn: string; nameTr: string; price: number }> = [
    { symbol: "GRAM", nameEn: "Gold (gram)", nameTr: "Gram Altin", price: gramAltin },
    {
      symbol: "CEYREK",
      nameEn: "Quarter Coin",
      nameTr: "Ceyrek Altin",
      price: gramAltin * TR_WEIGHTS.CEYREK,
    },
    {
      symbol: "YARIM",
      nameEn: "Half Coin",
      nameTr: "Yarim Altin",
      price: gramAltin * TR_WEIGHTS.YARIM,
    },
    { symbol: "TAM", nameEn: "Full Coin", nameTr: "Tam Altin", price: gramAltin * TR_WEIGHTS.TAM },
    { symbol: "ATA", nameEn: "Ata Coin", nameTr: "Ata Altin", price: gramAltin * TR_WEIGHTS.ATA },
    { symbol: "ONS", nameEn: "Gold Ounce (TRY)", nameTr: "Ons (TRY)", price: onsTry },
    { symbol: "GUMUS", nameEn: "Silver (gram)", nameTr: "Gumus (gram)", price: gramGumus },
  ];

  return prices.map((item) => ({
    symbol: item.symbol,
    nameEn: item.nameEn,
    nameTr: item.nameTr,
    price: item.price,
    currency: "TRY",
  }));
}
