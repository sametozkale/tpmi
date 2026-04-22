import { PortfolioLivePanel } from "@/components/portfolio/PortfolioLivePanel";

const portfolioInstruments = [
  { name: "Gold", symbol: "XAU", price: 2345.67, quantity: 0.72 },
  { name: "Silver", symbol: "XAG", price: 29.84, quantity: 6.55 },
  { name: "Platinum", symbol: "XPT", price: 978.5, quantity: 0.15 },
];

const portfolioRows = [
  {
    name: "Gold",
    ticker: "XAU",
    avgBuy: "$2,318.20",
    latest: "$2,345.67",
    profit: "+$27.47",
    change: "+1.19%",
    value: "$1,947.83",
  },
  {
    name: "Silver",
    ticker: "XAG",
    avgBuy: "$31.15",
    latest: "$29.84",
    profit: "-$1.31",
    change: "-4.20%",
    value: "$195.49",
  },
  {
    name: "Platinum",
    ticker: "XPT",
    avgBuy: "$954.10",
    latest: "$978.50",
    profit: "+$24.40",
    change: "+2.56%",
    value: "$148.12",
  },
];

export default function HoldingsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <PortfolioLivePanel instruments={portfolioInstruments} />

        <aside className="space-y-4 xl:col-span-4">
          <section className="rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-4">
            <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
              Cash
            </p>
            <p className="mt-1 font-title text-[28px] font-normal leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
              EUR 729.52
            </p>
            <button
              type="button"
              className="mt-3 rounded-full bg-[var(--color-button-primary)] px-4 py-2 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-inverted)]"
            >
              Deposit
            </button>
          </section>
        </aside>
      </div>

      <section className="rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-title text-[18px] font-normal tracking-[-0.02em] text-[var(--color-text-primary)]">
              Investments
            </p>
            <p className="mt-1 font-title text-[30px] font-normal leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
              EUR 1,828.07
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-y-2">
            <thead>
              <tr className="font-body text-[11px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                <th className="px-3 py-1 text-left font-normal">Name</th>
                <th className="px-3 py-1 text-left font-normal">Avg. buy price</th>
                <th className="px-3 py-1 text-left font-normal">Latest price</th>
                <th className="px-3 py-1 text-left font-normal">Profit</th>
                <th className="px-3 py-1 text-left font-normal">Change</th>
                <th className="px-3 py-1 text-left font-normal">Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolioRows.map((row) => (
                <tr
                  key={row.ticker}
                  className="rounded-[12px] bg-[var(--color-background-light-elevation)] font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)]"
                >
                  <td className="rounded-l-[12px] px-3 py-3">
                    <p>{row.name}</p>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">{row.ticker}</p>
                  </td>
                  <td className="px-3 py-3">{row.avgBuy}</td>
                  <td className="px-3 py-3">{row.latest}</td>
                  <td
                    className={`px-3 py-3 ${
                      row.profit.startsWith("+")
                        ? "text-[var(--color-text-positive)]"
                        : "text-[var(--color-text-negative)]"
                    }`}
                  >
                    {row.profit}
                  </td>
                  <td
                    className={`px-3 py-3 ${
                      row.change.startsWith("+")
                        ? "text-[var(--color-text-positive)]"
                        : "text-[var(--color-text-negative)]"
                    }`}
                  >
                    {row.change}
                  </td>
                  <td className="rounded-r-[12px] px-3 py-3 text-[var(--color-text-primary)]">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
