import { METAL_DETAILS, isMetalSymbol } from "@/lib/metals";
import type { TransactionRecord } from "@/types/transactions";
import type { MetalSymbol } from "@/types/metals";

export type HoldingPosition = {
  symbol: MetalSymbol;
  metalName: string;
  quantity: number;
  /** Remaining cost basis for open quantity */
  costBasis: number;
};

export type PortfolioTotals = {
  totalCostBasis: number;
  marketValue: number;
  profit: number;
  profitPct: number;
  openPositions: number;
};

function sortChronological(txs: TransactionRecord[]) {
  return [...txs].sort(
    (a, b) => new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime(),
  );
}

/**
 * Derives open positions from completed buy/sell history using average cost on sells.
 */
export function holdingsFromTransactions(transactions: TransactionRecord[]): HoldingPosition[] {
  const completed = sortChronological(
    transactions.filter((t) => t.status === "completed" && isMetalSymbol(t.symbol)),
  );

  const bySymbol = new Map<
    MetalSymbol,
    { quantity: number; costBasis: number; metalName: string }
  >();

  for (const tx of completed) {
    const symbol = tx.symbol;
    const metal = METAL_DETAILS[symbol];
    const cur = bySymbol.get(symbol) ?? {
      quantity: 0,
      costBasis: 0,
      metalName: metal.name,
    };

    if (tx.side === "buy") {
      bySymbol.set(symbol, {
        metalName: metal.name,
        quantity: cur.quantity + tx.quantity,
        costBasis: cur.costBasis + tx.totalValue,
      });
      continue;
    }

    const sellQty = Math.min(tx.quantity, cur.quantity);
    if (sellQty <= 0) continue;

    const avgCost = cur.quantity > 0 ? cur.costBasis / cur.quantity : 0;
    const nextQty = cur.quantity - sellQty;
    const nextCost = cur.costBasis - sellQty * avgCost;

    bySymbol.set(symbol, {
      metalName: metal.name,
      quantity: nextQty,
      costBasis: Math.max(0, nextCost),
    });
  }

  return Array.from(bySymbol.entries())
    .filter(([, v]) => v.quantity > 1e-8)
    .map(([symbol, v]) => ({
      symbol,
      metalName: v.metalName,
      quantity: v.quantity,
      costBasis: v.costBasis,
    }));
}

export function portfolioTotalsFromHoldings(positions: HoldingPosition[]): PortfolioTotals {
  let totalCostBasis = 0;
  let marketValue = 0;

  for (const p of positions) {
    const latest = METAL_DETAILS[p.symbol]?.price ?? 0;
    totalCostBasis += p.costBasis;
    marketValue += p.quantity * latest;
  }

  const profit = marketValue - totalCostBasis;
  const profitPct = totalCostBasis > 0 ? (profit / totalCostBasis) * 100 : 0;

  return {
    totalCostBasis,
    marketValue,
    profit,
    profitPct,
    openPositions: positions.length,
  };
}
