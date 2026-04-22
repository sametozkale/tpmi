export type MetalSymbol = "XAU" | "XAG" | "XPT" | "XPD";
export type Currency =
  | "USD"
  | "EUR"
  | "TRY"
  | "GBP"
  | "JPY"
  | "CNY"
  | "INR"
  | "AED"
  | "SAR"
  | "CHF"
  | "CAD"
  | "AUD";

export interface MetalPrice {
  symbol: MetalSymbol;
  currency: Currency;
  price: number;
  change: number;
  changePct: number;
  ask?: number;
  bid?: number;
  fetchedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  preferredCurrency: Currency;
  theme: "light" | "dark";
}
