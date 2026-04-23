"use client";

import {
  Button,
  ComboBox,
  IconChevronDown,
  Input,
  Label,
  ListBox,
  Popover,
} from "@heroui/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Key } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  getCountryOptions,
  type CountryOption,
} from "@/lib/country-options";
import { getRegionalDefaults, resolveCountryTimezone } from "@/lib/regional-config";
import { cn } from "@/lib/cn";
import { zodIssuesForForm } from "@/lib/validation/form-errors";
import { userProfileSchema } from "@/lib/validation/user";
import type { FormFieldIssue } from "@/lib/validation/form-errors";
import type { UserPreferences, UserProfile } from "@/types/user";

const countryItems = getCountryOptions();

function fieldError(issues: FormFieldIssue[], key: string) {
  return issues.find((i) => i.path[0] === key)?.message;
}

async function patchPreferences(partial: UserPreferences) {
  await fetch("/api/user/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });
}

export interface ProfileFormProps {
  initialProfile: UserProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialProfile),
  );
  const lastCountryRef = useRef(initialProfile.countryOfResidence);
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile.dateOfBirth);
  const [email, setEmail] = useState(initialProfile.email);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [countryOfResidence, setCountryOfResidence] = useState(
    initialProfile.countryOfResidence,
  );
  const [nationality, setNationality] = useState<string[]>(
    initialProfile.nationality,
  );
  const [timeZone, setTimeZone] = useState(initialProfile.timeZone);

  const [clientIssues, setClientIssues] = useState<FormFieldIssue[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const nationalitySummary = useMemo(() => {
    if (nationality.length === 0) return "Select up to 3 countries";
    const nameById = new Map(countryItems.map((c) => [c.id, c.name]));
    return nationality
      .map((code) => nameById.get(code) ?? code)
      .join(", ");
  }, [nationality]);

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        fullName,
        dateOfBirth,
        email,
        phone,
        countryOfResidence,
        nationality,
        preferredLanguage: "en",
        timeZone,
      }),
    [fullName, dateOfBirth, email, phone, countryOfResidence, nationality, timeZone],
  );
  const isDirty = currentSnapshot !== savedSnapshot;

  const onCountrySelectionChange = useCallback((key: Key | null) => {
    if (key == null) return;
    const code = String(key).toUpperCase();
    if (code === countryOfResidence) return;

    if (
      lastCountryRef.current &&
      code !== lastCountryRef.current &&
      typeof window !== "undefined" &&
      window.confirm(
        "Update your preferences to use this region’s default display unit and price source?",
      )
    ) {
      const d = getRegionalDefaults(code);
      void patchPreferences({
        displayUnit: d.displayUnit,
        priceSource: d.priceSource,
      });
    }

    lastCountryRef.current = code;
    setCountryOfResidence(code);
    setTimeZone(resolveCountryTimezone(code));
  }, [countryOfResidence]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setServerMessage(null);
    setClientIssues([]);

    const payload = {
      fullName,
      dateOfBirth,
      email,
      phone,
      countryOfResidence,
      nationality,
      preferredLanguage: "en" as const,
      timeZone,
    };

    const parsed = userProfileSchema.safeParse(payload);
    if (!parsed.success) {
      setClientIssues(zodIssuesForForm(parsed.error));
      setStatus("error");
      return;
    }

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      setStatus("error");
      setServerMessage("Could not save profile. Try again.");
      return;
    }

    setSavedSnapshot(JSON.stringify(parsed.data));
    setStatus("saved");
  }

  const selectPopoverClass =
    "overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)]";
  const listBoxClass = "max-h-64 overflow-auto p-[4px]";
  const listBoxItemClass =
    "rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-primary)] data-[hovered]:bg-[#f6f6f6] data-[focused]:bg-[#f6f6f6]";

  return (
    <form className="w-full max-w-[360px] space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
          htmlFor="fullName"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          placeholder="Your full name"
          className="tpmi-input"
        />
        {fieldError(clientIssues, "fullName") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "fullName")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
          htmlFor="dateOfBirth"
        >
          Date of birth
        </label>
        <div className="relative">
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="peer tpmi-input tpmi-input--date pr-10"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)] transition-colors duration-150 peer-focus:text-[var(--color-text-primary)]">
            <HugeiconsIcon icon={Calendar03Icon} size={18} />
          </span>
        </div>
        {fieldError(clientIssues, "dateOfBirth") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "dateOfBirth")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="tpmi-input"
        />
        {fieldError(clientIssues, "email") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "email")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
          htmlFor="phone"
        >
          Phone (E.164)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="+15551234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="tpmi-input"
        />
        {fieldError(clientIssues, "phone") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "phone")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Country of residence
        </Label>
        <ComboBox<CountryOption>
          items={countryItems}
          selectedKey={countryOfResidence}
          onSelectionChange={onCountrySelectionChange}
          aria-label="Country of residence"
          className="w-full"
          variant="secondary"
        >
          <ComboBox.InputGroup className="tpmi-select-trigger relative">
            <Input
              placeholder="Search country"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 pr-10 shadow-none outline-none"
            />
            <ComboBox.Trigger
              aria-label="Open country list"
              className="absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center bg-transparent p-0 text-[var(--color-text-tertiary)]"
            />
          </ComboBox.InputGroup>
          <ComboBox.Popover className={selectPopoverClass}>
            <ListBox className={listBoxClass}>
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
          </ComboBox.Popover>
        </ComboBox>
        {fieldError(clientIssues, "countryOfResidence") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "countryOfResidence")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Nationality (max 3)
        </span>
        <Popover>
          <Popover.Trigger
            className={cn(
              "tpmi-select-trigger relative flex items-center text-left",
            )}
          >
            <span className="line-clamp-2 pr-10">{nationalitySummary}</span>
            <IconChevronDown
              aria-hidden
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]"
            />
          </Popover.Trigger>
          <Popover.Content className={selectPopoverClass}>
            <NationalityPicker
              nationality={nationality}
              onChange={setNationality}
              listBoxClass={listBoxClass}
              listBoxItemClass={listBoxItemClass}
            />
          </Popover.Content>
        </Popover>
        {fieldError(clientIssues, "nationality") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "nationality")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
          htmlFor="preferredLanguage"
        >
          Preferred language
        </label>
        <input
          id="preferredLanguage"
          name="preferredLanguage"
          value="English"
          disabled
          className="tpmi-input cursor-not-allowed opacity-70"
        />
      </div>

      <div className="space-y-2">
        <span className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Time zone
        </span>
        <p className="tpmi-input flex items-center bg-[var(--color-background-elevation)]">
          {timeZone}
        </p>
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
          Derived from your country of residence.
        </p>
        {fieldError(clientIssues, "timeZone") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "timeZone")}
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
          {status === "saving" ? "Saving..." : "Save profile"}
        </Button>
      ) : null}

      {status === "saved" ? (
        <p className="font-body text-[13px] text-[var(--color-text-positive)]">
          Profile saved.
        </p>
      ) : null}
    </form>
  );
}

function NationalityPicker({
  nationality,
  onChange,
  listBoxClass,
  listBoxItemClass,
}: {
  nationality: string[];
  onChange: (next: string[]) => void;
  listBoxClass: string;
  listBoxItemClass: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countryItems;
    return countryItems.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-2 p-[4px]">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search countries"
        aria-label="Filter nationalities"
        className="tpmi-input w-full"
      />
      <ListBox<CountryOption>
        aria-label="Nationality"
        selectionMode="multiple"
        selectedKeys={new Set(nationality)}
        onSelectionChange={(keys) => {
          if (keys === "all") return;
          const next = Array.from(keys).map(String);
          if (next.length > 3) {
            window.alert("You can select up to 3 nationalities.");
            return;
          }
          onChange(next);
        }}
        items={filtered}
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
  );
}
