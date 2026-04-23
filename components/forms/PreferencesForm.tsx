"use client";

import { Button, Label, ListBox, Select } from "@heroui/react";
import { useMemo, useState } from "react";
import {
  DISPLAY_UNIT_OPTIONS,
  PRICE_SOURCE_OPTIONS,
} from "@/lib/user-settings-labels";
import { zodIssuesForForm } from "@/lib/validation/form-errors";
import { userPreferencesSchema } from "@/lib/validation/user";
import type { FormFieldIssue } from "@/lib/validation/form-errors";
import type { UserPreferences } from "@/types/user";

function fieldError(issues: FormFieldIssue[], key: string) {
  return issues.find((i) => i.path[0] === key)?.message;
}

export interface PreferencesFormProps {
  initialPreferences: UserPreferences;
}

export function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialPreferences),
  );
  const [displayUnit, setDisplayUnit] = useState(
    initialPreferences.displayUnit,
  );
  const [priceSource, setPriceSource] = useState(initialPreferences.priceSource);
  const [clientIssues, setClientIssues] = useState<FormFieldIssue[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setServerMessage(null);
    setClientIssues([]);

    const payload = { displayUnit, priceSource };
    const parsed = userPreferencesSchema.safeParse(payload);
    if (!parsed.success) {
      setClientIssues(zodIssuesForForm(parsed.error));
      setStatus("error");
      return;
    }

    const res = await fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      setStatus("error");
      setServerMessage("Could not save preferences. Try again.");
      return;
    }

    setSavedSnapshot(JSON.stringify(parsed.data));
    setStatus("saved");
  }

  const selectPopoverClass =
    "overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]";
  const listBoxClass =
    "max-h-64 overflow-auto p-[4px] [&_[role=option]]:rounded-[10px] [&_[role=option]]:px-[10px] [&_[role=option]]:py-2 [&_[role=option]]:font-body [&_[role=option]]:text-[14px] [&_[role=option]]:tracking-[-0.01em] [&_[role=option]]:text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]";
  const currentSnapshot = useMemo(
    () => JSON.stringify({ displayUnit, priceSource }),
    [displayUnit, priceSource],
  );
  const isDirty = currentSnapshot !== savedSnapshot;

  return (
    <form className="w-full max-w-[360px] space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Select
          className="w-full"
          variant="secondary"
          selectedKey={displayUnit}
          onSelectionChange={(key) => {
            if (key != null) setDisplayUnit(String(key) as UserPreferences["displayUnit"]);
          }}
          aria-label="Display unit"
        >
          <Label className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Display unit
          </Label>
          <Select.Trigger className="tpmi-select-trigger">
            <Select.Value />
            <Select.Indicator className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-[var(--color-text-tertiary)]" />
          </Select.Trigger>
          <Select.Popover className={selectPopoverClass}>
            <ListBox className={listBoxClass}>
              {DISPLAY_UNIT_OPTIONS.map((opt) => (
                <ListBox.Item
                  key={opt.id}
                  id={opt.id}
                  textValue={opt.label}
                  className="rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]"
                >
                  {opt.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        {fieldError(clientIssues, "displayUnit") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "displayUnit")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Select
          className="w-full"
          variant="secondary"
          selectedKey={priceSource}
          onSelectionChange={(key) => {
            if (key != null) setPriceSource(String(key) as UserPreferences["priceSource"]);
          }}
          aria-label="Price source"
        >
          <Label className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Price source
          </Label>
          <Select.Trigger className="tpmi-select-trigger">
            <Select.Value />
            <Select.Indicator className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-[var(--color-text-tertiary)]" />
          </Select.Trigger>
          <Select.Popover className={selectPopoverClass}>
            <ListBox className={listBoxClass}>
              {PRICE_SOURCE_OPTIONS.map((opt) => (
                <ListBox.Item
                  key={opt.id}
                  id={opt.id}
                  textValue={opt.label}
                  className="rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]"
                >
                  {opt.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        {fieldError(clientIssues, "priceSource") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "priceSource")}
          </p>
        ) : null}
      </div>

      {serverMessage ? (
        <p className="font-body text-[13px] text-[var(--color-text-critical)]">
          {serverMessage}
        </p>
      ) : null}

      {isDirty ? (
        <Button
          type="submit"
          variant="primary"
          isDisabled={status === "saving"}
          className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em]"
        >
          {status === "saving" ? "Saving..." : "Save preferences"}
        </Button>
      ) : null}

      {status === "saved" ? (
        <p className="font-body text-[13px] text-[var(--color-text-positive)]">
          Preferences saved.
        </p>
      ) : null}
    </form>
  );
}
