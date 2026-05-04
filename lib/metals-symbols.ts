import type { MetalSymbol } from "@/types/metals";

export type ProductSymbolMap = Record<MetalSymbol, string>;

export const DEFAULT_PRODUCT_SYMBOL_MAP: ProductSymbolMap = {
  XAU: "XAU",
  XAG: "XAG",
  XPT: "XPT",
  XPD: "XPD",
  RH: "XRH",
  IR: "IRD",
  RU: "RUTH",
  OS: "OSMIUM",
  XCU: "XCU",
  ALI: "ALU",
  NI: "NI",
  ZN: "ZNC",
  PB: "LEAD",
  SN: "TIN",
  CO: "LCO",
  TIO: "IRON",
  HRC: "STEEL-HR",
  UX: "URANIUM",
  LTH: "LITHIUM",
  MO: "MO",
};

const SYMBOL_CANDIDATES: Record<MetalSymbol, string[]> = {
  XAU: ["XAU"],
  XAG: ["XAG"],
  XPT: ["XPT"],
  XPD: ["XPD"],
  RH: ["XRH"],
  IR: ["IRD"],
  RU: ["RUTH"],
  OS: ["OSMIUM"],
  XCU: ["XCU", "LME-XCU"],
  ALI: ["ALU", "LME-ALU"],
  NI: ["NI", "LME-NI"],
  ZN: ["ZNC", "LME-ZNC"],
  PB: ["LEAD", "LME-LEAD"],
  SN: ["TIN", "LME-TIN"],
  CO: ["LCO"],
  TIO: ["IRON", "IRON62"],
  HRC: ["STEEL-HR", "STEEL-US"],
  UX: ["URANIUM"],
  LTH: ["LITHIUM"],
  MO: ["MO"],
};

function extractSupportedSymbolsFromPage(markdown: string): Set<string> {
  const set = new Set<string>();
  const regex = /\|\s*\[([A-Z0-9-]+)\]\(https:\/\/metals-api\.com\/symbols\/[A-Z0-9-]+\)\s*\|/g;
  let m: RegExpExecArray | null = regex.exec(markdown);
  while (m) {
    set.add(m[1]);
    m = regex.exec(markdown);
  }
  return set;
}

export async function fetchProductSymbolMapFromMetalsApi(): Promise<ProductSymbolMap> {
  const res = await fetch("https://metals-api.com/symbols", {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) {
    return DEFAULT_PRODUCT_SYMBOL_MAP;
  }

  const text = await res.text();
  const supported = extractSupportedSymbolsFromPage(text);
  if (supported.size === 0) {
    return DEFAULT_PRODUCT_SYMBOL_MAP;
  }

  const out = { ...DEFAULT_PRODUCT_SYMBOL_MAP };
  (Object.keys(SYMBOL_CANDIDATES) as MetalSymbol[]).forEach((key) => {
    const picked = SYMBOL_CANDIDATES[key].find((candidate) =>
      supported.has(candidate),
    );
    if (picked) out[key] = picked;
  });
  return out;
}

export function toIconLabel(displaySymbol: string): string {
  const normalized = displaySymbol.toUpperCase();
  const compact = normalized.includes("-")
    ? normalized.split("-")[0]
    : normalized;
  if (compact.length <= 3) return compact;
  return compact.slice(0, 3);
}
