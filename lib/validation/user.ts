import countries from "i18n-iso-countries";
import { z } from "zod";

const displayUnitSchema = z.enum([
  "gram",
  "troy_ounce",
  "tola",
  "baht",
  "kilogram",
]);

const priceSourceSchema = z.enum([
  "LBMA",
  "KAPALICARSI",
  "MCX",
  "SGE",
  "COMEX",
  "LOCAL_MARKET",
]);

function isValidIsoAlpha2(code: string): boolean {
  return countries.isValid(code);
}

function isValidIanaTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function isAtLeast18YearsOld(isoDate: string): boolean {
  const birth = new Date(isoDate + "T12:00:00Z");
  if (Number.isNaN(birth.getTime())) return false;
  const now = new Date();
  const cutoff = new Date(
    now.getFullYear() - 18,
    now.getMonth(),
    now.getDate(),
  );
  return birth <= cutoff;
}

/** Letters (Unicode letters), spaces, hyphens — single full name field */
const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(120, "Full name must be at most 120 characters")
  .regex(
    /^[\p{L}\s\-]+$/u,
    "Use letters, spaces, and hyphens only",
  );

const emailSchema = z.string().trim().email("Enter a valid email address");

/** E.164: + followed by country code and subscriber number */
const e164Schema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{1,14}$/,
    "Phone must be in E.164 format (e.g. +15551234567)",
  );

export const userProfileSchema = z.object({
  fullName: fullNameSchema,
  dateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .refine(isAtLeast18YearsOld, "You must be at least 18 years old"),
  email: emailSchema,
  phone: e164Schema,
  countryOfResidence: z
    .string()
    .trim()
    .toUpperCase()
    .length(2)
    .refine(isValidIsoAlpha2, "Invalid country code"),
  nationality: z
    .array(z.string().trim().toUpperCase().length(2))
    .min(1, "Select at least one nationality")
    .max(3, "You can select up to 3 nationalities")
    .refine(
      (arr) => arr.every((c) => isValidIsoAlpha2(c)),
      "Invalid nationality code",
    ),
  preferredLanguage: z.literal("en"),
  timeZone: z
    .string()
    .trim()
    .min(1)
    .refine(isValidIanaTimeZone, "Invalid time zone"),
});

export const userPreferencesSchema = z.object({
  displayUnit: displayUnitSchema,
  priceSource: priceSourceSchema,
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
