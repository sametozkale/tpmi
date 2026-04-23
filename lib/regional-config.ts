import type { DisplayUnit, IsoCountryCode, PriceSource } from "@/types/user";

export type RegionalProductId = string;

export interface RegionalConfig {
  timeZone: string;
  displayUnit: DisplayUnit;
  priceSource: PriceSource;
  products: RegionalProductId[];
}

/** EU member states (ISO 3166-1 alpha-2) for default product schema */
const EU_MEMBER_CODES = new Set<IsoCountryCode>([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
]);

const TR_PRODUCTS: RegionalProductId[] = [
  "gram",
  "ceyrek",
  "yarim",
  "tam",
  "ata",
  "resat",
  "ziynet",
  "bilezik_22k",
  "bilezik_24k",
];

const IN_NP_PRODUCTS: RegionalProductId[] = ["tola_bar", "jewellery_22k", "sgb"];

const TH_PRODUCTS: RegionalProductId[] = ["baht_bar_965"];

const GB_PRODUCTS: RegionalProductId[] = ["sovereign", "britannia"];

const US_PRODUCTS: RegionalProductId[] = ["american_eagle", "buffalo", "copper_pound"];

const CN_PRODUCTS: RegionalProductId[] = ["chi", "tael", "gram"];

const GCC_EG_PRODUCTS: RegionalProductId[] = [
  "tola",
  "gram",
  "jewellery_21k",
  "jewellery_22k",
];

const EU_DEFAULT_PRODUCTS: RegionalProductId[] = [
  "gram",
  "kilobar",
  "troy_ounce_lbma",
];

/** Capital / primary IANA zone per country (simplified single zone per country) */
const COUNTRY_TIMEZONE: Record<string, string> = {
  TR: "Europe/Istanbul",
  US: "America/New_York",
  GB: "Europe/London",
  IN: "Asia/Kolkata",
  NP: "Asia/Kathmandu",
  TH: "Asia/Bangkok",
  CN: "Asia/Shanghai",
  AE: "Asia/Dubai",
  SA: "Asia/Riyadh",
  QA: "Asia/Qatar",
  KW: "Asia/Kuwait",
  BH: "Asia/Bahrain",
  OM: "Asia/Muscat",
  EG: "Africa/Cairo",
  DE: "Europe/Berlin",
  FR: "Europe/Paris",
  NL: "Europe/Amsterdam",
  IT: "Europe/Rome",
  ES: "Europe/Madrid",
  PL: "Europe/Warsaw",
  RO: "Europe/Bucharest",
  SE: "Europe/Stockholm",
  AT: "Europe/Vienna",
  BE: "Europe/Brussels",
  BG: "Europe/Sofia",
  HR: "Europe/Zagreb",
  CY: "Asia/Nicosia",
  CZ: "Europe/Prague",
  DK: "Europe/Copenhagen",
  EE: "Europe/Tallinn",
  FI: "Europe/Helsinki",
  GR: "Europe/Athens",
  HU: "Europe/Budapest",
  IE: "Europe/Dublin",
  LV: "Europe/Riga",
  LT: "Europe/Vilnius",
  LU: "Europe/Luxembourg",
  MT: "Europe/Malta",
  PT: "Europe/Lisbon",
  SK: "Europe/Bratislava",
  SI: "Europe/Ljubljana",
  JP: "Asia/Tokyo",
  AU: "Australia/Sydney",
  CA: "America/Toronto",
  BR: "America/Sao_Paulo",
  MX: "America/Mexico_City",
  ZA: "Africa/Johannesburg",
  CH: "Europe/Zurich",
  NO: "Europe/Oslo",
  NZ: "Pacific/Auckland",
};

function upperCountry(code: string): IsoCountryCode {
  return code.trim().toUpperCase();
}

export function resolveCountryTimezone(countryCode: string): string {
  const c = upperCountry(countryCode);
  return COUNTRY_TIMEZONE[c] ?? "UTC";
}

function buildConfig(
  timeZone: string,
  displayUnit: DisplayUnit,
  priceSource: PriceSource,
  products: RegionalProductId[],
): RegionalConfig {
  return { timeZone, displayUnit, priceSource, products };
}

function configForCountry(c: IsoCountryCode): RegionalConfig {
  switch (c) {
    case "TR":
      return buildConfig(
        resolveCountryTimezone(c),
        "gram",
        "KAPALICARSI",
        TR_PRODUCTS,
      );
    case "IN":
    case "NP":
      return buildConfig(resolveCountryTimezone(c), "tola", "MCX", IN_NP_PRODUCTS);
    case "TH":
      return buildConfig(resolveCountryTimezone(c), "baht", "LBMA", TH_PRODUCTS);
    case "GB":
      return buildConfig(
        resolveCountryTimezone(c),
        "troy_ounce",
        "LBMA",
        GB_PRODUCTS,
      );
    case "US":
      return buildConfig(
        resolveCountryTimezone(c),
        "troy_ounce",
        "COMEX",
        US_PRODUCTS,
      );
    case "CN":
      return buildConfig(resolveCountryTimezone(c), "gram", "SGE", CN_PRODUCTS);
    case "AE":
    case "SA":
    case "QA":
    case "KW":
    case "BH":
    case "OM":
    case "EG":
      return buildConfig(
        resolveCountryTimezone(c),
        "gram",
        "LBMA",
        GCC_EG_PRODUCTS,
      );
    default:
      if (EU_MEMBER_CODES.has(c)) {
        return buildConfig(
          resolveCountryTimezone(c),
          "gram",
          "LBMA",
          EU_DEFAULT_PRODUCTS,
        );
      }
      return buildConfig(resolveCountryTimezone(c), "gram", "LBMA", ["gram"]);
  }
}

export function getRegionalDefaults(countryCode: string): Omit<RegionalConfig, "products"> {
  const cfg = configForCountry(upperCountry(countryCode));
  return {
    timeZone: cfg.timeZone,
    displayUnit: cfg.displayUnit,
    priceSource: cfg.priceSource,
  };
}

export function getProductsForCountry(countryCode: string): RegionalProductId[] {
  return configForCountry(upperCountry(countryCode)).products;
}

export function getFullRegionalConfig(countryCode: string): RegionalConfig {
  return configForCountry(upperCountry(countryCode));
}

/**
 * Signup / detection helper: pick best guess country from signals (caller supplies what is available).
 */
export function inferSignupCountry(signals: {
  ipCountry?: string | null;
  simCountry?: string | null;
  navigatorLanguage?: string | null;
}): IsoCountryCode {
  const fromIp = signals.ipCountry?.trim().toUpperCase();
  if (fromIp && fromIp.length === 2) return fromIp;

  const fromSim = signals.simCountry?.trim().toUpperCase();
  if (fromSim && fromSim.length === 2) return fromSim;

  const lang = signals.navigatorLanguage?.trim();
  if (lang) {
    const region = lang.split("-")[1]?.toUpperCase();
    if (region && region.length === 2) return region;
  }

  return "US";
}
