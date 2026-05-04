import countries from "i18n-iso-countries";
import { z } from "zod";

function isValidIsoAlpha2(code: string): boolean {
  return countries.isValid(code);
}

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

function isValidIanaTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Non-empty full name: letters, spaces, hyphens */
const nonEmptyFullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(120, "Full name must be at most 120 characters")
  .regex(
    /^[\p{L}\s\-]+$/u,
    "Use letters, spaces, and hyphens only",
  );

export const userProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), nonEmptyFullNameSchema])),
  email: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.literal(""),
        z.string().email("Enter a valid email address"),
      ]),
    ),
  preferredLanguage: z.literal("en"),
  timeZone: z
    .string()
    .trim()
    .min(1)
    .refine(isValidIanaTimeZone, "Invalid time zone"),
});

export const userPreferencesSchema = z.object({
  operationsCountry: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .pipe(z.string().length(2).refine(isValidIsoAlpha2, "Invalid country")),
  displayUnit: displayUnitSchema,
  priceSource: priceSourceSchema,
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
