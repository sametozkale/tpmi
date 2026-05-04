"use client";

import {
  Button,
  IconChevronDown,
  Label,
  ListBox,
  Popover,
  Select,
} from "@heroui/react";
import type { Key } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getCountryOptions,
  type CountryOption,
} from "@/lib/country-options";
import { getRegionalDefaults } from "@/lib/regional-config";
import { cn } from "@/lib/cn";
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

const countryItems = getCountryOptions();

export interface PreferencesFormProps {
  initialPreferences: UserPreferences;
}

export function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialPreferences),
  );
  const [operationsCountry, setOperationsCountry] = useState(
    initialPreferences.operationsCountry,
  );
  const [countryQuery, setCountryQuery] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryTriggerRef = useRef<HTMLDivElement>(null);
  const [countryPopoverWidth, setCountryPopoverWidth] = useState<number | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    if (!isCountryOpen) return;
    const el = countryTriggerRef.current;
    if (!el) return;
    setCountryPopoverWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver(() => {
      if (!countryTriggerRef.current) return;
      setCountryPopoverWidth(countryTriggerRef.current.getBoundingClientRect().width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isCountryOpen]);
  const [displayUnit, setDisplayUnit] = useState(
    initialPreferences.displayUnit,
  );
  const [priceSource, setPriceSource] = useState(initialPreferences.priceSource);
  const [clientIssues, setClientIssues] = useState<FormFieldIssue[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const countryNameById = useMemo(
    () => new Map(countryItems.map((c) => [c.id, c.name])),
    [],
  );
  const filteredCountryItems = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return countryItems;
    return countryItems.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [countryQuery]);

  const onCountrySelectionChange = useCallback((key: Key | null) => {
    if (key == null) return;
    const code = String(key).toUpperCase();
    if (code === operationsCountry) return;
    const d = getRegionalDefaults(code);
    setOperationsCountry(code);
    setDisplayUnit(d.displayUnit);
    setPriceSource(d.priceSource);
  }, [operationsCountry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setClientIssues([]);

    const payload: UserPreferences = {
      operationsCountry,
      displayUnit,
      priceSource,
    };
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
      toast.error("Could not save preferences. Try again.");
      return;
    }

    setSavedSnapshot(JSON.stringify(parsed.data));
    setStatus("saved");
    toast.success("Preferences saved.");
  }

  const selectPopoverClass =
    "overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]";
  const listBoxClass =
    "max-h-64 overflow-auto p-[4px] [&_[role=option]]:rounded-[10px] [&_[role=option]]:px-[10px] [&_[role=option]]:py-2 [&_[role=option]]:font-body [&_[role=option]]:text-[14px] [&_[role=option]]:tracking-[-0.01em] [&_[role=option]]:text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]";
  const listBoxItemClass =
    "rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]";

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        operationsCountry,
        displayUnit,
        priceSource,
      }),
    [operationsCountry, displayUnit, priceSource],
  );
  const isDirty = currentSnapshot !== savedSnapshot;

  return (
    <form className="w-full max-w-[360px] space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Operations country
        </Label>
        <Popover isOpen={isCountryOpen} onOpenChange={setIsCountryOpen}>
          <Popover.Trigger
            ref={countryTriggerRef}
            className="tpmi-select-trigger relative flex w-full min-w-0 items-center text-left"
          >
            <span className="line-clamp-1 pr-10">
              {countryNameById.get(operationsCountry) ?? operationsCountry}
            </span>
            <IconChevronDown
              aria-hidden
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]"
            />
          </Popover.Trigger>
          <Popover.Content
            className={cn(selectPopoverClass, "box-border min-w-0")}
            offset={4}
            placement="bottom start"
            style={
              countryPopoverWidth != null
                ? { width: countryPopoverWidth }
                : undefined
            }
          >
            <div className="flex flex-col gap-2 p-[4px]">
              <input
                type="search"
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder="Search country"
                aria-label="Search operations country"
                className="tpmi-input w-full"
              />
              <ListBox<CountryOption>
                aria-label="Operations country"
                selectionMode="single"
                selectedKeys={new Set([operationsCountry])}
                onSelectionChange={(keys) => {
                  if (keys === "all") return;
                  const [next] = Array.from(keys);
                  if (!next) return;
                  onCountrySelectionChange(next);
                  setCountryQuery("");
                  setIsCountryOpen(false);
                }}
                items={filteredCountryItems}
                className={listBoxClass}
              >
                {(item: CountryOption) => (
                  <ListBox.Item
                    id={item.id}
                    textValue={item.name}
                    className={listBoxItemClass}
                  >
                    {item.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </div>
          </Popover.Content>
        </Popover>
        <p className="font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-tertiary)]">
          Defaults for units and pricing; for Turkey + gold, transaction entry uses tam / yarım / çeyrek / gram.
          Changing country reapplies suggested display unit and price source below—both stay editable.
        </p>
        {fieldError(clientIssues, "operationsCountry") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "operationsCountry")}
          </p>
        ) : null}
      </div>

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
          <Label
            className={cn(
              "block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]",
            )}
          >
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
                  className={listBoxItemClass}
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
                  className={listBoxItemClass}
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
    </form>
  );
}
