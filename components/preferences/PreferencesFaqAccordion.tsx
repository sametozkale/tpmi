"use client";

import { IconChevronDown } from "@heroui/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const FAQ_ITEMS = [
  {
    id: "display-unit",
    question: "What is the display unit?",
    answer:
      "It controls which unit amounts are shown in (gram, troy ounce, tola, and similar).",
  },
  {
    id: "price-source",
    question: "What does price source do?",
    answer:
      "It chooses which reference venue or benchmark prices follow (e.g. COMEX, LBMA, Kapalıçarşı).",
  },
  {
    id: "country-defaults",
    question: "Why do defaults follow my country?",
    answer:
      "On first setup we suggest defaults that match where you trade so the experience feels relevant; you can change them anytime.",
  },
] as const;

export function PreferencesFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="tpmi-card-surface p-5">
      <h2 className="font-title text-[18px] font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
        FAQ
      </h2>
      <div className="mt-4 space-y-2">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          const panelId = `faq-panel-${item.id}`;
          const buttonId = `faq-trigger-${item.id}`;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-background-light-elevation)]"
            >
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-[#f0f0f0]/80"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <h3 className="font-body text-[13px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                  {item.question}
                </h3>
                <IconChevronDown
                  aria-hidden
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={cn(isOpen && "block border-t border-[var(--color-border-soft)]")}
              >
                <p className="px-3 pb-3 pt-2 font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
