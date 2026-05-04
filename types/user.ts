/**
 * User profile and preferences for settings surfaces (/profile, /preferences).
 * Distinct from auth user metadata; persisted via API stubs.
 */

export type PreferredLanguage = "en";

export type DisplayUnit = "gram" | "troy_ounce" | "tola" | "baht" | "kilogram";

export type PriceSource =
  | "LBMA"
  | "KAPALICARSI"
  | "MCX"
  | "SGE"
  | "COMEX"
  | "LOCAL_MARKET";

/** ISO 3166-1 alpha-2 */
export type IsoCountryCode = string;

export interface UserProfile {
  fullName: string;
  email: string;
  preferredLanguage: PreferredLanguage;
  /** IANA time zone; read-only in UI, from browser when available */
  timeZone: string;
}

export interface UserPreferences {
  /** ISO 3166-1 alpha-2 — drives default units, price source, and transaction presets */
  operationsCountry: IsoCountryCode;
  displayUnit: DisplayUnit;
  priceSource: PriceSource;
}
