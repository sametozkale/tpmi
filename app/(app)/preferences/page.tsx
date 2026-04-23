import { PreferencesForm } from "@/components/forms/PreferencesForm";
import { createClient } from "@/lib/supabase/server";
import { getRegionalDefaults } from "@/lib/regional-config";

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const regional = getRegionalDefaults("US");
  const initialPreferences = {
    displayUnit: regional.displayUnit,
    priceSource: regional.priceSource,
  };

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="w-[360px] space-y-8">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Preferences
          </h1>
          <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Units and pricing sources. Defaults follow your region (stub: US).
          </p>
        </div>

        <section className="w-full">
          <PreferencesForm initialPreferences={initialPreferences} />
        </section>
      </div>
    </div>
  );
}
