import type { Currency } from "@/types/metals";

/**
 * Demo FX table (base USD). Replace with live rates when market feed is wired.
 */
const USD_TO_CURRENCY_RATE: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  TRY: 32.5,
  GBP: 0.79,
  JPY: 155.4,
  CNY: 7.22,
  INR: 83.1,
  AED: 3.67,
  SAR: 3.75,
  CHF: 0.91,
  CAD: 1.37,
  AUD: 1.52,
};

export function convertUsdToCurrency(usdValue: number, currency: Currency): number {
  return usdValue * USD_TO_CURRENCY_RATE[currency];
}
