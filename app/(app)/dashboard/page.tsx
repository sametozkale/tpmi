import { CurrencySelector } from "@/components/prices/CurrencySelector";
import { MetalCard } from "@/components/prices/MetalCard";
import { METALS_LIST } from "@/lib/metals";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-title text-[30px] font-normal leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
            Markets
          </h1>
          <p className="max-w-xl font-body text-[15px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Live precious metals spot prices (placeholder data for Phase 0).
          </p>
        </div>
        <div className="flex justify-end">
          <CurrencySelector />
        </div>
      </header>

      <section
        aria-label="Metal spot snapshot"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {METALS_LIST.map((m) => (
          <MetalCard
            key={m.symbol}
            symbol={m.symbol}
            name={m.name}
            price={m.price}
            change={m.change}
            changePct={m.changePct}
            currency="USD"
            href={`/markets/${m.symbol}`}
          />
        ))}
      </section>
    </div>
  );
}
