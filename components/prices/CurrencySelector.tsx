"use client";

import { Label, ListBox, Select } from "@heroui/react";
import type { Currency } from "@/types/metals";

const CURRENCIES: { id: Currency; name: string }[] = [
  { id: "USD", name: "USD" },
  { id: "EUR", name: "EUR" },
  { id: "TRY", name: "TRY" },
  { id: "GBP", name: "GBP" },
  { id: "JPY", name: "JPY" },
  { id: "CNY", name: "CNY" },
  { id: "INR", name: "INR" },
  { id: "AED", name: "AED" },
  { id: "SAR", name: "SAR" },
  { id: "CHF", name: "CHF" },
  { id: "CAD", name: "CAD" },
  { id: "AUD", name: "AUD" },
];

export function CurrencySelector() {
  return (
    <Select
      className="min-w-[140px]"
      variant="secondary"
      defaultValue="USD"
      placeholder="Currency"
      aria-label="Display currency"
    >
      <Label className="sr-only">Currency</Label>
      <Select.Trigger className="tpmi-select-trigger">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]">
        <ListBox className="max-h-64 overflow-auto p-[4px]">
          {CURRENCIES.map((c) => (
            <ListBox.Item
              key={c.id}
              id={c.id}
              textValue={c.name}
              className="rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)] data-[focused]:bg-[var(--color-background-elevation)]"
            >
              {c.name}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
