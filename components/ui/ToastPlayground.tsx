"use client";

import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export function ToastPlayground() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="primary"
          className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em]"
          onClick={() =>
            toast.success("Saved successfully", {
              description: "Your portfolio settings have been updated.",
              icon: (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  color="var(--color-text-positive)"
                  strokeWidth={2}
                />
              ),
            })
          }
        >
          Show success toast
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[var(--color-text-secondary)]"
          onClick={() =>
            toast("Sync started", {
              description: "Latest spot prices are being refreshed.",
              icon: (
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={16}
                  color="var(--color-text-link)"
                  strokeWidth={2}
                />
              ),
            })
          }
        >
          Show info toast
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[var(--color-text-negative)]"
          onClick={() =>
            toast.error("Action failed", {
              description: "Could not complete request. Try again.",
              icon: (
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={16}
                  color="var(--color-text-negative)"
                  strokeWidth={2}
                />
              ),
            })
          }
        >
          Show error toast
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em]"
          onClick={() => toast.dismiss()}
        >
          Dismiss all
        </Button>
      </div>
      <p className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
        Sonner-based minimal toast simulation. Trigger from buttons and inspect
        spacing, color, and motion.
      </p>
    </div>
  );
}
