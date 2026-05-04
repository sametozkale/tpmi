import type { MetalSymbol } from "./metals";

export type TransactionSide = "buy" | "sell";
export type TransactionStatus = "completed" | "pending";

export interface TransactionRecord {
  id: string;
  metalName: string;
  symbol: MetalSymbol;
  side: TransactionSide;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  executedAt: string;
  status: TransactionStatus;
  note: string;
}

export interface CreateTransactionInput {
  symbol: MetalSymbol;
  side: TransactionSide;
  quantity: number;
  unitPrice: number;
  executedAt: string;
  note: string;
  /** Omitted or unset → server defaults to completed */
  status?: TransactionStatus;
}

export interface UpdateTransactionInput {
  symbol: MetalSymbol;
  side: TransactionSide;
  quantity: number;
  unitPrice: number;
  executedAt: string;
  note: string;
}
