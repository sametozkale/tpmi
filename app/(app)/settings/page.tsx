import { ThemeSwitch } from "@/components/layout/ThemeSwitch";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
          Settings
        </h1>
        <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Preferences for currency, language, and theme will expand beyond Phase
          0.
        </p>
      </div>

      <section className="tpmi-card-surface max-w-md space-y-3 p-5">
        <h2 className="font-title text-[18px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
          Appearance
        </h2>
        <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Toggle dark mode (sidebar on desktop, header on mobile).
        </p>
        <div className="flex items-center gap-3 pt-2">
          <span className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Theme
          </span>
          <ThemeSwitch />
        </div>
      </section>
    </div>
  );
}
