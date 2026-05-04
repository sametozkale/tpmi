import type { TransactionRecord } from "@/types/transactions";

export type TransactionDbRow = {
  tx_id: string;
  metal_name: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  unit_price: number;
  total_value: number;
  executed_at: string;
  status: "completed" | "pending";
  note: string;
};

export function mapTransactionFromDbRow(row: TransactionDbRow): TransactionRecord {
  return {
    id: row.tx_id,
    metalName: row.metal_name,
    symbol: row.symbol as TransactionRecord["symbol"],
    side: row.side,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    totalValue: row.total_value,
    executedAt: row.executed_at,
    status: row.status,
    note: row.note,
  };
}
