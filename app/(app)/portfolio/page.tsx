import { PortfolioLivePanel } from "@/components/portfolio/PortfolioLivePanel";
import { PortfolioTotalsTable } from "@/components/portfolio/PortfolioTables";
import { holdingsFromTransactions, portfolioTotalsFromHoldings } from "@/lib/portfolio/from-transactions";
import { createClient } from "@/lib/supabase/server";
import { mapTransactionFromDbRow } from "@/lib/transactions/map-db-row";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: txRows } = await supabase
    .from("transactions")
    .select(
      "tx_id, metal_name, symbol, side, quantity, unit_price, total_value, executed_at, status, note",
    )
    .eq("user_id", user.id)
    .order("executed_at", { ascending: false });

  const transactions = (txRows ?? []).map(mapTransactionFromDbRow);
  const positions = holdingsFromTransactions(transactions);
  const totals = portfolioTotalsFromHoldings(positions);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
          Portfolio
        </h1>
        <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Live precious metals portfolio summary and totals from your trades.
        </p>
      </header>

      <PortfolioLivePanel transactions={transactions} />

      <section className="space-y-3">
        <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
          Total portfolio
        </h2>
        <PortfolioTotalsTable totals={totals} positions={positions} />
      </section>
    </div>
  );
}
