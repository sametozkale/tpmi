"use client";

import { Button } from "@heroui/react";
import { useSyncExternalStore } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { zodIssuesForForm } from "@/lib/validation/form-errors";
import { userProfileSchema } from "@/lib/validation/user";
import type { FormFieldIssue } from "@/lib/validation/form-errors";
import type { UserProfile } from "@/types/user";

function fieldError(issues: FormFieldIssue[], key: string) {
  return issues.find((i) => i.path[0] === key)?.message;
}

function getBrowserTimeZoneSnapshot() {
  if (typeof window === "undefined") return null;
  return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
}

function subscribeNoop() {
  return () => {};
}

function useBrowserTimeZone() {
  return useSyncExternalStore(
    subscribeNoop,
    getBrowserTimeZoneSnapshot,
    () => null,
  );
}

export interface ProfileFormProps {
  initialProfile: UserProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const browserTimeZone = useBrowserTimeZone();
  const effectiveTimeZone = browserTimeZone ?? initialProfile.timeZone;
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify({
      ...initialProfile,
    }),
  );
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [email, setEmail] = useState(initialProfile.email);

  const [clientIssues, setClientIssues] = useState<FormFieldIssue[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        fullName,
        email,
        preferredLanguage: "en",
      }),
    [fullName, email],
  );
  const isDirty = currentSnapshot !== savedSnapshot;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setClientIssues([]);

    const payload = {
      fullName,
      email,
      preferredLanguage: "en" as const,
      timeZone: effectiveTimeZone,
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
      toast.error("Could not save profile. Try again.");
      return;
    }

    setSavedSnapshot(currentSnapshot);
    setStatus("saved");
    toast.success("Profile saved.");
  }

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
          {effectiveTimeZone}
        </p>
        <p className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
          Synced from your browser time zone.
        </p>
        {fieldError(clientIssues, "timeZone") ? (
          <p className="tpmi-error">
            {fieldError(clientIssues, "timeZone")}
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
          {status === "saving" ? "Saving..." : "Save profile"}
        </Button>
      ) : null}
    </form>
  );
}
