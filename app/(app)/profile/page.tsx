import { ProfileForm } from "@/components/forms/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { resolveCountryTimezone } from "@/lib/regional-config";
import type { UserProfile } from "@/types/user";

function profileFromUser(user: {
  email: string | undefined;
  user_metadata: Record<string, unknown> | undefined;
}): UserProfile {
  const meta = user.user_metadata ?? {};
  const fullName =
    typeof meta.full_name === "string"
      ? meta.full_name
      : typeof meta.display_name === "string"
        ? meta.display_name
      : typeof meta.name === "string"
        ? meta.name
        : "";

  const defaultCountry = "US";

  return {
    fullName,
    dateOfBirth: "",
    email: user.email ?? "",
    phone: "",
    countryOfResidence: defaultCountry,
    nationality: [defaultCountry],
    preferredLanguage: "en",
    timeZone: resolveCountryTimezone(defaultCountry),
  };
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const initialProfile = profileFromUser({
    email: user.email,
    user_metadata: user.user_metadata as Record<string, unknown> | undefined,
  });

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="w-[360px] space-y-8">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Profile
          </h1>
          <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Your personal details and regional defaults.
          </p>
        </div>

        <section className="w-full">
          <ProfileForm initialProfile={initialProfile} />
        </section>
      </div>
    </div>
  );
}
