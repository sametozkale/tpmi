import Link from "next/link";

const SETTINGS_LINKS = [
  {
    href: "/profile",
    title: "Profile",
    description: "Manage your personal information and account details.",
  },
  {
    href: "/preferences",
    title: "Preferences",
    description: "Update display, country, and pricing defaults.",
  },
] as const;

export default function SettingsPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="w-[420px] space-y-8">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Settings
          </h1>
          <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Quick access to account settings. Select a section below.
          </p>
        </div>

        <nav aria-label="Settings sections" className="space-y-3">
          {SETTINGS_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-[14px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] px-4 py-3 transition-colors hover:bg-[var(--color-hover-tertiary)]"
            >
              <p className="font-body text-[14px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                {item.title}
              </p>
              <p className="mt-1 font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                {item.description}
              </p>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
