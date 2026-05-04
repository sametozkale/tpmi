"use client";

import {
  type ReactNode,
  type SelectHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@heroui/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { METAL_DETAILS, METALS_LIST, isMetalSymbol } from "@/lib/metals";
import {
  getTurkishGoldPresetOptions,
  formatTroyOzForInput,
  formatTurkishGoldPresetAutoNoteEnglish,
} from "@/lib/turkish-gold-presets";
import { gramsToTroyOz } from "@/lib/units/precious-metal";
import type {
  CreateTransactionInput,
  TransactionRecord,
  TransactionSide,
  UpdateTransactionInput,
} from "@/types/transactions";
import type { UserPreferences } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TrGoldKind = "tam" | "yarim" | "ceyrek" | "gram";

const fetchTransactionsList = () =>
  fetch("/api/transactions", { method: "GET", cache: "no-store" });

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function monthGroupLabel(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function toDateTimeLocal(value: string) {
  const d = new Date(value);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

type EditFormState = {
  symbol: UpdateTransactionInput["symbol"];
  side: UpdateTransactionInput["side"];
  quantity: string;
  unitPrice: string;
  executedAt: string;
  note: string;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalKey, setAddModalKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      setIsLoading(true);
      const res = await fetchTransactionsList();
      const json = (await res.json().catch(() => null)) as
        | { transactions?: TransactionRecord[]; error?: string; details?: string }
        | null;

      if (!mounted) return;

      if (!res.ok || !json?.transactions) {
        toast.error(json?.error ?? "Could not load transactions.");
        if (json?.details) toast.message(json.details);
        setTransactions([]);
        setSelectedId(null);
        setIsLoading(false);
        return;
      }

      setTransactions(json.transactions);
      setSelectedId(json.transactions[0]?.id ?? null);
      setIsLoading(false);
    }

    void loadTransactions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedId]);

  const selected = useMemo(
    () => transactions.find((t) => t.id === selectedId) ?? transactions[0] ?? null,
    [selectedId, transactions],
  );

  const grouped = useMemo(() => {
    return transactions.reduce<Record<string, TransactionRecord[]>>((acc, tx) => {
      const key = monthGroupLabel(tx.executedAt);
      if (!acc[key]) acc[key] = [];
      acc[key].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  function beginEdit(tx: TransactionRecord) {
    setEditForm({
      symbol: tx.symbol,
      side: tx.side,
      quantity: String(tx.quantity),
      unitPrice: String(tx.unitPrice),
      executedAt: toDateTimeLocal(tx.executedAt),
      note: tx.note,
    });
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditForm(null);
  }

  async function handleCreateTransaction(input: CreateTransactionInput) {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = (await res.json().catch(() => null)) as
      | { transaction?: TransactionRecord; error?: string; details?: string }
      | null;

    if (!res.ok || !json?.transaction) {
      toast.error(json?.error ?? "Could not save transaction.");
      if (json?.details) toast.message(json.details);
      return;
    }

    setTransactions((prev) => [json.transaction!, ...prev]);
    setSelectedId(json.transaction.id);
    setIsModalOpen(false);
    toast.success("Transaction saved.");
    router.refresh();
  }

  async function handleUpdateSelected() {
    if (!selected || !editForm) return;
    const quantity = Number(editForm.quantity || 0);
    const unitPrice = Number(editForm.unitPrice || 0);
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0.");
      return;
    }
    if (unitPrice <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    setIsSavingEdit(true);
    const res = await fetch(`/api/transactions/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: editForm.symbol,
        side: editForm.side,
        quantity,
        unitPrice,
        executedAt: new Date(editForm.executedAt).toISOString(),
        note: editForm.note.trim() || "Manual entry",
      } satisfies UpdateTransactionInput),
    });
    const json = (await res.json().catch(() => null)) as
      | { transaction?: TransactionRecord; error?: string; details?: string }
      | null;

    if (!res.ok || !json?.transaction) {
      toast.error(json?.error ?? "Could not update transaction.");
      if (json?.details) toast.message(json.details);
      setIsSavingEdit(false);
      return;
    }

    setTransactions((prev) =>
      prev.map((tx) => (tx.id === json.transaction!.id ? json.transaction! : tx)),
    );
    setIsSavingEdit(false);
    cancelEdit();
    toast.success("Transaction updated.");
    router.refresh();
  }

  async function handleDeleteSelected() {
    if (!selected) return;

    const idToDelete = selected.id;
    const selectedIdBefore = selectedId;

    setIsDeleteConfirmOpen(false);
    setIsDeleting(true);
    const res = await fetch(`/api/transactions/${idToDelete}`, {
      method: "DELETE",
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string; details?: string }
      | null;

    if (!res.ok || !json?.ok) {
      toast.error(json?.error ?? "Could not delete transaction.");
      if (json?.details) toast.message(String(json.details));
      setIsDeleting(false);
      return;
    }

    cancelEdit();
    toast.success("Transaction deleted.");

    /** Optimistic UI so the row disappears immediately (GET can still be cached without no-store). */
    const nextLocal = transactions.filter((tx) => tx.id !== idToDelete);
    const nextSelected =
      selectedIdBefore !== idToDelete && nextLocal.some((t) => t.id === selectedIdBefore)
        ? selectedIdBefore
        : nextLocal[0]?.id ?? null;
    setTransactions(nextLocal);
    setSelectedId(nextSelected);
    setIsDeleting(false);

    /** Refresh server components (e.g. portfolio) that read transactions from Supabase. */
    router.refresh();

    const listRes = await fetchTransactionsList();
    const listJson = (await listRes.json().catch(() => null)) as
      | { transactions?: TransactionRecord[]; error?: string }
      | null;

    if (listRes.ok && Array.isArray(listJson?.transactions)) {
      setTransactions(listJson.transactions);
      setSelectedId(
        listJson.transactions.some((t) => t.id === nextSelected)
          ? nextSelected
          : listJson.transactions[0]?.id ?? null,
      );
      return;
    }

    if (listJson?.error) toast.message(listJson.error);
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
            Transactions
          </h1>
          <p className="font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Buy/sell history with execution time, quantity, and price details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddModalKey((k) => k + 1);
            setIsModalOpen(true);
          }}
          className="inline-flex h-[34px] items-center rounded-[12px] bg-[var(--color-button-primary)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-white transition-colors hover:bg-[var(--color-hover-primary)]"
        >
          Add transaction
        </button>
      </header>

      {isLoading ? (
        <section className="flex min-h-[320px] items-center justify-center rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-8 text-center">
          <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Loading transactions...
          </p>
        </section>
      ) : transactions.length === 0 ? (
        <section className="flex min-h-[420px] items-center justify-center rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-8 text-center">
          <div className="space-y-2">
            <p className="font-title text-[22px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
              No transactions yet
            </p>
            <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
              Your precious metal buy/sell history will appear here.
            </p>
          </div>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-12">
          <div className="tpmi-card-surface p-4 xl:col-span-7">
            <div className="space-y-5">
              {Object.entries(grouped).map(([month, rows]) => (
                <div key={month} className="space-y-2">
                  <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                    {month}
                  </p>
                  <div className="space-y-1.5">
                    {rows.map((tx) => {
                      const isSelected = selected?.id === tx.id;
                      const isBuy = tx.side === "buy";
                      return (
                        <button
                          key={tx.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(tx.id);
                            if (isEditing) cancelEdit();
                          }}
                          className={`grid w-full grid-cols-[1fr_auto] gap-x-3 gap-y-1 rounded-[12px] px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? "bg-[#f2f2f2]"
                              : "hover:bg-[#f2f2f2]"
                          }`}
                        >
                          <p className="min-w-0 truncate font-body text-[14px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                            {isBuy ? "Buy" : "Sell"} {tx.metalName}
                          </p>
                          <p
                            className={`min-w-0 justify-self-end whitespace-nowrap text-right font-body text-[13px] font-medium tracking-[-0.01em] ${
                              isBuy
                                ? "text-[var(--color-text-negative)]"
                                : "text-[var(--color-text-positive)]"
                            }`}
                          >
                            {isBuy ? "-" : "+"}${formatMoney(tx.totalValue)}
                          </p>
                          <p className="min-w-0 truncate font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                            {tx.symbol} · {tx.note}
                          </p>
                          <p className="justify-self-end whitespace-nowrap font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                            {formatDateTime(tx.executedAt)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="tpmi-card-surface self-start p-5 xl:col-span-5">
            {selected ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
                      {selected.side === "buy" ? "-" : "+"}$
                      {formatMoney(selected.totalValue)}
                    </p>
                    <p className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                      {selected.side === "buy" ? "Buy" : "Sell"} {selected.metalName}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-body text-[11px] tracking-[-0.01em] ${
                      selected.status === "completed"
                        ? "bg-[var(--color-background-success)] text-[var(--color-text-positive)]"
                        : "bg-[var(--color-background-warning)] text-[var(--color-accent-gold)]"
                    }`}
                  >
                    {selected.status === "completed" ? "Complete" : "Pending"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <p className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                    {isEditing ? "Edit transaction" : "Transaction details"}
                  </p>
                  <div className="h-px w-full bg-[var(--color-border-soft)]" aria-hidden />
                  {isEditing && editForm ? (
                    <div className="space-y-3 pt-1">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Metal">
                          <SelectNative
                            value={editForm.symbol}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev ? { ...prev, symbol: e.target.value as EditFormState["symbol"] } : prev,
                              )
                            }
                          >
                            {METALS_LIST.map((m) => (
                              <option key={m.symbol} value={m.symbol}>
                                {m.name} ({m.symbol})
                              </option>
                            ))}
                          </SelectNative>
                        </Field>
                        <Field label="Type">
                          <SelectNative
                            value={editForm.side}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev ? { ...prev, side: e.target.value as TransactionSide } : prev,
                              )
                            }
                          >
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                          </SelectNative>
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Quantity (troy oz)">
                          <input
                            className="tpmi-input"
                            type="number"
                            min="0.0001"
                            step="0.0001"
                            value={editForm.quantity}
                            onChange={(e) =>
                              setEditForm((prev) => (prev ? { ...prev, quantity: e.target.value } : prev))
                            }
                          />
                        </Field>
                        <Field label="Price (USD / troy oz)">
                          <input
                            className="tpmi-input"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={editForm.unitPrice}
                            onChange={(e) =>
                              setEditForm((prev) => (prev ? { ...prev, unitPrice: e.target.value } : prev))
                            }
                          />
                        </Field>
                      </div>
                      <Field label="Time">
                        <div className="relative">
                          <input
                            className="peer tpmi-input tpmi-input--date pr-10"
                            type="datetime-local"
                            value={editForm.executedAt}
                            onChange={(e) =>
                              setEditForm((prev) => (prev ? { ...prev, executedAt: e.target.value } : prev))
                            }
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)] transition-colors duration-150 peer-focus:text-[var(--color-text-primary)]">
                            <HugeiconsIcon icon={Calendar03Icon} size={18} />
                          </span>
                        </div>
                      </Field>
                      <Field label="Note">
                        <input
                          className="tpmi-input"
                          type="text"
                          maxLength={120}
                          value={editForm.note}
                          onChange={(e) =>
                            setEditForm((prev) => (prev ? { ...prev, note: e.target.value } : prev))
                          }
                        />
                      </Field>
                      <DetailRow
                        label="Total"
                        value={`$${formatMoney(
                          Number(editForm.quantity || 0) * Number(editForm.unitPrice || 0),
                        )}`}
                      />
                      <DetailRow label="ID" value={selected.id} mono />
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <DetailRow label="Time" value={formatDateTime(selected.executedAt)} />
                      <DetailRow label="Metal" value={selected.metalName} />
                      <DetailRow label="Symbol" value={selected.symbol} />
                      <DetailRow label="Type" value={selected.side === "buy" ? "Buy" : "Sell"} />
                      <DetailRow label="Quantity" value={`${selected.quantity} oz`} />
                      <DetailRow label="Price" value={`$${formatMoney(selected.unitPrice)}`} />
                      <DetailRow label="Total" value={`$${formatMoney(selected.totalValue)}`} />
                      <DetailRow label="ID" value={selected.id} mono />
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div className="h-px w-full bg-[var(--color-border-soft)]" aria-hidden />
                  <div className="flex flex-wrap justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex h-[32px] items-center rounded-[10px] bg-[var(--color-background-elevation)] px-3 font-body text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-secondary)]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateSelected}
                          disabled={isSavingEdit}
                          className="inline-flex h-[32px] items-center rounded-[10px] bg-[var(--color-button-primary)] px-3 font-body text-[13px] font-medium text-white hover:bg-[var(--color-hover-primary)] disabled:opacity-60"
                        >
                          {isSavingEdit ? "Saving..." : "Save"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => beginEdit(selected)}
                        className="inline-flex h-[32px] items-center rounded-[10px] bg-[var(--color-background-elevation)] px-3 font-body text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-hover-secondary)]"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                            <path
                              d="M12.9 3.6a1.9 1.9 0 0 1 2.7 0l.8.8a1.9 1.9 0 0 1 0 2.7l-7.8 7.8-3.5.8.8-3.5z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.4 5.1l3.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Edit
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      disabled={isDeleting}
                      className="inline-flex h-[32px] items-center rounded-[10px] border border-[var(--color-border-primary)] px-3 font-body text-[13px] text-[var(--color-text-negative)] hover:bg-[var(--color-background-negative-tint)] disabled:opacity-60"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                          <path
                            d="M4.5 5.5h11M8 5.5V4.4c0-.5.4-.9.9-.9h2.2c.5 0 .9.4.9.9v1.1m-6.9 0 .6 9.2c0 .9.8 1.6 1.7 1.6h4.2c.9 0 1.7-.7 1.7-1.6l.6-9.2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isDeleting ? "Deleting..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      )}

      <AddTransactionModal
        key={addModalKey}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />

      {isDeleteConfirmOpen && selected ? (
        <DeleteTransactionConfirmModal
          transaction={selected}
          isDeleting={isDeleting}
          onClose={() => {
            if (!isDeleting) setIsDeleteConfirmOpen(false);
          }}
          onConfirm={handleDeleteSelected}
        />
      ) : null}
    </div>
  );
}

function DeleteTransactionConfirmModal({
  transaction,
  isDeleting,
  onClose,
  onConfirm,
}: {
  transaction: TransactionRecord;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-tx-title"
        className="w-full max-w-[440px] rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5 shadow-[var(--shadow-1)]"
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2
            id="delete-tx-title"
            className="min-w-0 font-title text-[22px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]"
          >
            Delete this transaction?
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[var(--color-text-secondary)] transition-colors hover:bg-[#f2f2f2] hover:text-[var(--color-text-primary)] disabled:pointer-events-none disabled:opacity-40"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 font-body text-[14px] leading-relaxed tracking-[-0.01em] text-[var(--color-text-secondary)]">
          This action cannot be undone. The transaction will be removed from your history, and your portfolio will update
          automatically.
        </p>

        <div className="mt-4 h-px w-full bg-[var(--color-border-soft)]" aria-hidden />

        <div className="mt-4 space-y-2">
          <p className="font-body text-[12px] font-normal tracking-[-0.01em] text-[var(--color-text-tertiary)]">
            Transaction ID
          </p>
          <div className="rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-3 py-2.5">
            <p className="font-mono text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-primary)]">
              {transaction.id}
            </p>
          </div>
          <p className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
            {transaction.side === "buy" ? "Buy" : "Sell"} {transaction.metalName} · {transaction.symbol}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onPress={onClose}
            isDisabled={isDeleting}
            className="h-[34px] rounded-[12px] bg-[var(--color-background-elevation)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[#777] hover:bg-[var(--color-hover-secondary)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onPress={() => void onConfirm()}
            isDisabled={isDeleting}
            className="h-[34px] rounded-[12px] border border-[var(--color-text-negative)] bg-[var(--color-background-negative-tint)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[var(--color-text-negative)] hover:opacity-90"
          >
            {isDeleting ? "Deleting…" : "Delete permanently"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddTransactionModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
}) {
  const [symbol, setSymbol] = useState("XAU");
  const [side, setSide] = useState<TransactionSide>("buy");
  const [quantity, setQuantity] = useState("0.1");
  const [unitPrice, setUnitPrice] = useState("0");
  const [executedAt, setExecutedAt] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [trGoldKind, setTrGoldKind] = useState<TrGoldKind>("tam");
  const [gramAmount, setGramAmount] = useState("");
  /** Preset coin count for tam / yarım / çeyrek (not used for gram). */
  const [presetCount, setPresetCount] = useState(1);
  const [useReferenceBuyPrice, setUseReferenceBuyPrice] = useState(false);

  const isTrGold =
    !!prefs && prefs.operationsCountry === "TR" && symbol === "XAU";

  const trPresetOption =
    isTrGold && trGoldKind !== "gram"
      ? getTurkishGoldPresetOptions().find((p) => p.id === trGoldKind)
      : null;

  const effectiveQtyTroy = useMemo(() => {
    if (!isTrGold) return Number(quantity || 0);
    if (trGoldKind === "gram") {
      const g = Number(gramAmount || 0);
      return g > 0 ? gramsToTroyOz(g) : 0;
    }
    const opt = getTurkishGoldPresetOptions().find((p) => p.id === trGoldKind);
    const unitOz = opt?.troyOz ?? 0;
    const n = Math.max(1, Math.floor(presetCount));
    return unitOz * n;
  }, [isTrGold, trGoldKind, gramAmount, quantity, presetCount]);

  const catalogUnitUsd = useMemo(() => {
    if (!isMetalSymbol(symbol)) return 0;
    const p = METAL_DETAILS[symbol].price;
    return typeof p === "number" && Number.isFinite(p) && p > 0 ? p : 0;
  }, [symbol]);

  const resolvedUnitPriceUsd = useMemo(() => {
    if (side === "buy" && useReferenceBuyPrice && catalogUnitUsd > 0) {
      return catalogUnitUsd;
    }
    return Number(unitPrice || 0);
  }, [side, useReferenceBuyPrice, catalogUnitUsd, unitPrice]);

  const totalEstimate = useMemo(
    () => effectiveQtyTroy * resolvedUnitPriceUsd,
    [effectiveQtyTroy, resolvedUnitPriceUsd],
  );

  useEffect(() => {
    if (!open) return;
    setUseReferenceBuyPrice(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((j: { preferences?: UserPreferences }) => {
        if (!j.preferences) return;
        setPrefs(j.preferences);
        if (j.preferences.operationsCountry === "TR") {
          setTrGoldKind("tam");
          setPresetCount(1);
          const t = getTurkishGoldPresetOptions().find((p) => p.id === "tam");
          if (t) setQuantity(formatTroyOzForInput(t.troyOz));
          setGramAmount("");
        }
      });
  }, [open]);

  function onMetalChange(next: string) {
    setSymbol(next);
    if (prefs?.operationsCountry === "TR" && next === "XAU") {
      setTrGoldKind("tam");
      setPresetCount(1);
      const t = getTurkishGoldPresetOptions().find((p) => p.id === "tam");
      if (t) setQuantity(formatTroyOzForInput(t.troyOz));
      setGramAmount("");
    }
  }

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (resolvedUnitPriceUsd <= 0) {
      toast.error(
        side === "buy" && useReferenceBuyPrice
          ? "No catalog reference price for this metal. Enter a price manually."
          : "Price must be greater than 0.",
      );
      return;
    }
    if (effectiveQtyTroy <= 0) {
      toast.error(
        isTrGold && trGoldKind === "gram"
          ? "Enter a gold weight in grams."
          : "Quantity must be greater than 0.",
      );
      return;
    }
    let noteOut = note.trim();
    if (!noteOut && isTrGold) {
      if (trGoldKind === "gram") {
        noteOut = gramAmount.trim()
          ? `${gramAmount.trim()} g gold`
          : "Manual entry";
      } else {
        noteOut = formatTurkishGoldPresetAutoNoteEnglish(
          trGoldKind,
          presetCount,
        );
      }
    }
    if (!noteOut) noteOut = "Manual entry";

    if (side === "buy" && useReferenceBuyPrice && catalogUnitUsd > 0) {
      const suffix = " · Est. entry (catalog)";
      const combined = noteOut + suffix;
      if (combined.length <= 120) noteOut = combined;
    }

    setSaving(true);
    await onSubmit({
      symbol: symbol as CreateTransactionInput["symbol"],
      side,
      quantity: effectiveQtyTroy,
      unitPrice: resolvedUnitPriceUsd,
      executedAt: new Date(executedAt).toISOString(),
      note: noteOut,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[560px] rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5 shadow-[var(--shadow-2)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-title text-[22px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
            Add transaction
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--color-text-secondary)] transition-colors hover:bg-[#f2f2f2] hover:text-[var(--color-text-primary)]"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Metal">
              <SelectNative value={symbol} onChange={(e) => onMetalChange(e.target.value)}>
                {METALS_LIST.map((m) => (
                  <option key={m.symbol} value={m.symbol}>
                    {m.name} ({m.symbol})
                  </option>
                ))}
              </SelectNative>
            </Field>
            <Field label="Type">
              <SelectNative
                value={side}
                onChange={(e) => {
                  const v = e.target.value as TransactionSide;
                  setSide(v);
                  if (v === "sell") setUseReferenceBuyPrice(false);
                }}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </SelectNative>
            </Field>
          </div>

          {side === "buy" ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-background-light-elevation)] px-3 py-3">
              <input
                type="checkbox"
                checked={useReferenceBuyPrice}
                onChange={(e) => setUseReferenceBuyPrice(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-border-primary)] text-[var(--color-button-primary)]"
              />
              <span className="space-y-1">
                <span className="block font-body text-[13px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                  I don&apos;t know my purchase price (USD / oz)
                </span>
                <span className="block font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  We&apos;ll use the in-app catalog reference for this metal so your holding and portfolio stay in sync.
                  You can edit the price later from the transaction list.
                </span>
              </span>
            </label>
          ) : null}

          {isTrGold ? (
            <div className="space-y-2">
              <span className="block font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-primary)]">
                Gold amount (Turkey)
              </span>
              <div className="flex flex-wrap gap-2">
                {getTurkishGoldPresetOptions().map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="tpmi-range-chip"
                    data-active={trGoldKind === p.id}
                    onClick={() => {
                      setTrGoldKind(p.id);
                      setPresetCount(1);
                      setQuantity(formatTroyOzForInput(p.troyOz));
                    }}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="tpmi-range-chip"
                  data-active={trGoldKind === "gram"}
                  onClick={() => {
                    setTrGoldKind("gram");
                  }}
                >
                  Gram
                </button>
              </div>
              {trGoldKind !== "gram" ? (
                <div className="flex flex-wrap items-end gap-3">
                  <Field label="Pieces">
                    <input
                      className="tpmi-input max-w-[120px]"
                      type="number"
                      min={1}
                      step={1}
                      value={presetCount}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setPresetCount(
                          Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1,
                        );
                      }}
                    />
                  </Field>
                </div>
              ) : null}
              <p className="font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                Tam / yarım / çeyrek use common Cumhuriyet fine-gold gram weights; amounts are stored as troy oz for
                pricing.
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={
                isTrGold && trGoldKind === "gram"
                  ? "Quantity (grams)"
                  : isTrGold
                    ? "Quantity (troy oz)"
                    : "Quantity (troy oz)"
              }
            >
              {isTrGold && trGoldKind === "gram" ? (
                <input
                  className="tpmi-input"
                  type="number"
                  min="0.0001"
                  step="0.001"
                  value={gramAmount}
                  onChange={(e) => setGramAmount(e.target.value)}
                  placeholder="e.g. 10"
                />
              ) : (
                <input
                  className="tpmi-input"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={
                    isTrGold && trPresetOption
                      ? formatTroyOzForInput(
                          trPresetOption.troyOz * Math.max(1, presetCount),
                        )
                      : quantity
                  }
                  onChange={(e) => setQuantity(e.target.value)}
                  readOnly={!!isTrGold && trGoldKind !== "gram"}
                  aria-readonly={!!isTrGold && trGoldKind !== "gram"}
                  title={
                    isTrGold && trGoldKind !== "gram"
                      ? "Set via Tam / Yarım / Çeyrek and Pieces"
                      : undefined
                  }
                />
              )}
            </Field>
            <Field
              label={
                side === "buy" && useReferenceBuyPrice
                  ? "Price (USD / troy oz) — catalog estimate"
                  : "Price (USD / troy oz)"
              }
            >
              <input
                className={`tpmi-input ${side === "buy" && useReferenceBuyPrice ? "cursor-not-allowed bg-[var(--color-background-elevation)] text-[var(--color-text-secondary)]" : ""}`}
                type="number"
                min="0.01"
                step="0.01"
                value={
                  side === "buy" && useReferenceBuyPrice && catalogUnitUsd > 0
                    ? String(catalogUnitUsd)
                    : unitPrice
                }
                onChange={(e) => setUnitPrice(e.target.value)}
                readOnly={side === "buy" && useReferenceBuyPrice}
                aria-readonly={side === "buy" && useReferenceBuyPrice}
                title={
                  side === "buy" && useReferenceBuyPrice
                    ? "Uncheck “I don't know my purchase price” to type your own"
                    : undefined
                }
              />
            </Field>
          </div>

          <Field label="Time">
            <div className="relative">
              <input
                className="peer tpmi-input tpmi-input--date pr-10"
                type="datetime-local"
                value={executedAt}
                onChange={(e) => setExecutedAt(e.target.value)}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)] transition-colors duration-150 peer-focus:text-[var(--color-text-primary)]">
                <HugeiconsIcon icon={Calendar03Icon} size={18} />
              </span>
            </div>
          </Field>

          <Field label="Note">
            <input
              className="tpmi-input"
              type="text"
              maxLength={120}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Spot accumulation"
            />
          </Field>

          <div className="mt-2 rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-background-light-elevation)] px-3 py-2">
            <p className="font-body text-[12px] text-[var(--color-text-tertiary)]">Total</p>
            <p className="font-title text-[26px] tracking-[-0.02em] text-[var(--color-text-primary)]">
              ${formatMoney(totalEstimate || 0)}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[34px] items-center rounded-[12px] bg-[var(--color-background-elevation)] px-4 font-body text-[14px] text-[#777] hover:bg-[var(--color-hover-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-[34px] items-center rounded-[12px] bg-[var(--color-button-primary)] px-4 font-body text-[14px] font-medium text-white hover:bg-[var(--color-hover-primary)] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="block font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-primary)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectNative(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`tpmi-input cursor-pointer appearance-none pr-10 ${className ?? ""}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)]">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-2">
      <span className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
        {label}
      </span>
      <span
        className={`text-right font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)] ${
          mono ? "font-mono text-[12px]" : "font-medium"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
