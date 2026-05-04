"use client";

import { Table } from "@heroui/react";
import { MetalSymbolIcon } from "@/components/prices/MetalSymbolIcon";
import { useProductSymbolMap } from "@/lib/hooks/useProductSymbolMap";
import { toIconLabel } from "@/lib/metals-symbols";
import type { HoldingPosition, PortfolioTotals } from "@/lib/portfolio/from-transactions";

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PortfolioTotalsTable({
  totals,
  positions,
}: {
  totals: PortfolioTotals;
  positions: HoldingPosition[];
}) {
  const profitPositive = totals.profit > 0;
  const profitNegative = totals.profit < 0;
  const returnTone = profitPositive
    ? "text-[var(--color-text-positive)]"
    : profitNegative
      ? "text-[var(--color-text-negative)]"
      : "text-[var(--color-text-primary)]";
  const showReturnPct = totals.totalCostBasis > 0;
  const profitLabel =
    totals.profit === 0
      ? `$${formatMoney(0)}`
      : `${profitPositive ? "+" : "-"}$${formatMoney(Math.abs(totals.profit))}`;

  const symbolMap = useProductSymbolMap();

  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Portfolio overview"
        className="min-w-[480px] overflow-hidden rounded-b-[14px]"
      >
        <Table.Content className="-mb-1 w-full min-w-[480px] border-separate border-spacing-y-1">
          <Table.Header className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            <Table.Column isRowHeader className="h-auto bg-transparent px-3 py-1 text-left font-normal">
              Active metals
            </Table.Column>
            <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
              Current value
            </Table.Column>
            <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
              Cost basis
            </Table.Column>
            <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
              Return
            </Table.Column>
            <Table.Column className="h-auto bg-transparent px-3 py-1 text-right font-normal">
              Positions
            </Table.Column>
          </Table.Header>
          <Table.Body className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)]">
            <Table.Row>
              <Table.Cell className="rounded-l-[12px] bg-white px-3 py-3 align-middle">
                {positions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {positions.map((position) => (
                      <span
                        key={position.symbol}
                        className="inline-flex items-center gap-1.5"
                      >
                        <MetalSymbolIcon
                          symbol={position.symbol}
                          size={20}
                          labelOverride={toIconLabel(symbolMap[position.symbol] ?? position.symbol)}
                        />
                        <span className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--color-background-elevation)] px-2 py-0.5 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-primary)]">
                          <span className="font-medium">{position.metalName}</span>
                          <span className="text-[var(--color-text-secondary)]">({position.symbol})</span>
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                    —
                  </span>
                )}
              </Table.Cell>
              <Table.Cell className="bg-white px-3 py-3 align-middle font-medium">
                ${formatMoney(totals.marketValue)}
              </Table.Cell>
              <Table.Cell className="bg-white px-3 py-3 align-middle">
                ${formatMoney(totals.totalCostBasis)}
              </Table.Cell>
              <Table.Cell className={`bg-white px-3 py-3 align-middle ${returnTone}`}>
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-medium">{profitLabel}</span>
                  <span className="font-body text-[12px] font-normal tracking-[-0.01em] opacity-90">
                    {showReturnPct
                      ? `${totals.profitPct >= 0 ? "+" : ""}${totals.profitPct.toFixed(2)}%`
                      : "—"}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className="rounded-r-[12px] bg-white px-3 py-3 align-middle text-right tabular-nums">
                {totals.openPositions}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>
    </div>
  );
}
