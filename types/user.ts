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
  /** ISO date string YYYY-MM-DD */
  dateOfBirth: string;
  email: string;
  /** E.164 */
  phone: string;
  countryOfResidence: IsoCountryCode;
  /** Up to 3 ISO country codes */
  nationality: IsoCountryCode[];
  preferredLanguage: PreferredLanguage;
  /** IANA time zone; auto-derived from country, read-only in UI */
  timeZone: string;
}

export interface UserPreferences {
  displayUnit: DisplayUnit;
  priceSource: PriceSource;
}
