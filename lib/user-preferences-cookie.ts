import { getRegionalDefaults } from "@/lib/regional-config";
import { userPreferencesSchema } from "@/lib/validation/user";
import type { UserPreferences } from "@/types/user";

export const USER_PREFERENCES_COOKIE = "tpmi_user_preferences";

export function defaultUserPreferences(): UserPreferences {
  const code = "US";
  const r = getRegionalDefaults(code);
  return {
    operationsCountry: code,
    displayUnit: r.displayUnit,
    priceSource: r.priceSource,
  };
}

export function parseUserPreferencesCookie(raw: string | undefined): UserPreferences {
  if (!raw) return defaultUserPreferences();
  try {
    const data: unknown = JSON.parse(raw);
    const parsed = userPreferencesSchema.safeParse(data);
    if (parsed.success) return parsed.data;
  } catch {
    /* ignore */
  }
  return defaultUserPreferences();
}
