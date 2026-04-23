import { PortfolioLivePanel } from "@/components/portfolio/PortfolioLivePanel";
import { Table } from "@heroui/react";
import { METALS_LIST } from "@/lib/metals";

const portfolioInstruments = METALS_LIST.slice(0, 8).map((metal, index) => ({
  name: metal.name,
  symbol: metal.symbol,
  price: metal.price,
  quantity: 0.18 + index * 0.07,
}));

const portfolioRows = METALS_LIST.map((metal, index) => {
  const quantity = 0.16 + (index % 7) * 0.06;
  const avgBuyValue = metal.price - metal.change;
  const valueAmount = metal.price * quantity;

  return {
    name: metal.name,
    ticker: metal.symbol,
    avgBuy: `$${avgBuyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    latest: `$${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    profit: `${metal.change >= 0 ? "+" : ""}$${Math.abs(metal.change).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    change: `${metal.changePct >= 0 ? "+" : ""}${metal.changePct.toFixed(2)}%`,
    value: `$${valueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
});

export default function HoldingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
          Portfolio
        </h1>
        <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Live precious metals portfolio summary and allocations.
        </p>
      </header>

      <PortfolioLivePanel instruments={portfolioInstruments} />

      <section className="tpmi-card-surface p-5">
        <div className="mb-4 flex items-end justify-between">
          <div className="space-y-2">
            <p className="font-body text-[15px] font-normal leading-none tracking-[-0.01em] text-[var(--color-text-secondary)]">
              Investments
            </p>
            <p className="font-title text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
              EUR 1,828.07
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            aria-label="Investments table"
            className="min-w-[620px] overflow-hidden rounded-b-[14px]"
          >
            <Table.Content className="-mb-1 w-full min-w-[620px] border-separate border-spacing-y-1">
              <Table.Header className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                <Table.Column isRowHeader className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                  Name
                </Table.Column>
                <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                  Avg. buy price
                </Table.Column>
                <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                  Latest price
                </Table.Column>
                <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                  Profit
                </Table.Column>
                <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">
                  Change
                </Table.Column>
                <Table.Column className="h-auto bg-transparent px-3 py-1 text-left font-normal">Value</Table.Column>
              </Table.Header>
              <Table.Body className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)]">
                {portfolioRows.map((row) => (
                  <Table.Row key={row.ticker}>
                    <Table.Cell className="rounded-l-[12px] bg-white px-3 py-3 align-middle">
                      <p>{row.name}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">{row.ticker}</p>
                    </Table.Cell>
                    <Table.Cell className="bg-white px-3 py-3 align-middle">
                      {row.avgBuy}
                    </Table.Cell>
                    <Table.Cell className="bg-white px-3 py-3 align-middle">
                      {row.latest}
                    </Table.Cell>
                    <Table.Cell
                      className={`bg-white px-3 py-3 align-middle ${
                        row.profit.startsWith("+")
                          ? "text-[var(--color-text-positive)]"
                          : "text-[var(--color-text-negative)]"
                      }`}
                    >
                      {row.profit}
                    </Table.Cell>
                    <Table.Cell
                      className={`bg-white px-3 py-3 align-middle ${
                        row.change.startsWith("+")
                          ? "text-[var(--color-text-positive)]"
                          : "text-[var(--color-text-negative)]"
                      }`}
                    >
                      {row.change}
                    </Table.Cell>
                    <Table.Cell className="rounded-r-[12px] bg-white px-3 py-3 align-middle">
                      {row.value}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        </div>
      </section>
    </div>
  );
}
