import type { DisplayUnit, PriceSource } from "@/types/user";

export const DISPLAY_UNIT_OPTIONS: { id: DisplayUnit; label: string }[] = [
  { id: "gram", label: "Gram" },
  { id: "troy_ounce", label: "Troy ounce" },
  { id: "tola", label: "Tola" },
  { id: "baht", label: "Baht" },
  { id: "kilogram", label: "Kilogram" },
];

export const PRICE_SOURCE_OPTIONS: { id: PriceSource; label: string }[] = [
  { id: "LBMA", label: "LBMA" },
  { id: "KAPALICARSI", label: "Kapalıçarşı" },
  { id: "MCX", label: "MCX" },
  { id: "SGE", label: "SGE" },
  { id: "COMEX", label: "COMEX" },
  { id: "LOCAL_MARKET", label: "Local market" },
];
