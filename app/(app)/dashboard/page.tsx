import { CurrencySelector } from "@/components/prices/CurrencySelector";
import { PricesStatusNotice } from "@/components/prices/PricesStatusNotice";
import { SpotSection } from "@/components/prices/SpotSection";
import { TrSection } from "@/components/prices/TrSection";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Markets
          </h1>
          <p className="max-w-xl font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Live precious metal spot prices converted with the selected display currency.
          </p>
        </div>
        <div className="flex justify-end">
          <CurrencySelector />
        </div>
      </header>

      <section className="space-y-4">
        <PricesStatusNotice />
        <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
          International markets
        </h2>
        <SpotSection />
      </section>

      <section className="space-y-4">
        <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
          Turkiye market (derived)
        </h2>
        <TrSection />
      </section>

      <p className="font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-tertiary)]">
        Turkiye prices are derived from global spot x FX rates and shown as midpoint values; dealer buy/sell spread is
        not included.
      </p>
    </div>
  );
}
