export type MetalSymbol =
  | "XAU"
  | "XAG"
  | "XPT"
  | "XPD"
  | "RH"
  | "IR"
  | "RU"
  | "OS"
  | "XCU"
  | "ALI"
  | "NI"
  | "ZN"
  | "PB"
  | "SN"
  | "CO"
  | "TIO"
  | "HRC"
  | "UX"
  | "LTH"
  | "MO";
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
