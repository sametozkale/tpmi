import { PreferencesFaqAccordion } from "@/components/preferences/PreferencesFaqAccordion";
import { PreferencesForm } from "@/components/forms/PreferencesForm";
import { createClient } from "@/lib/supabase/server";
import {
  USER_PREFERENCES_COOKIE,
  parseUserPreferencesCookie,
} from "@/lib/user-preferences-cookie";
import { cookies } from "next/headers";

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const jar = await cookies();
  const initialPreferences = parseUserPreferencesCookie(
    jar.get(USER_PREFERENCES_COOKIE)?.value,
  );

  return (
    <div className="flex min-h-[calc(100svh-7rem)] w-full flex-col lg:min-h-[calc(100svh-5.5rem)]">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
              Preferences
            </h1>
            <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
              Choose where you trade; we set units and price source to match, and tailor gold entry (e.g. Turkish
              denominations).
            </p>
          </div>

          <section className="w-full">
            <PreferencesForm initialPreferences={initialPreferences} />
          </section>
        </div>

        <section className="mt-auto w-full pt-12 pb-2">
          <PreferencesFaqAccordion />
        </section>
      </div>
    </div>
  );
}
