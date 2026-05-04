"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const triggerClass =
  "-m-0.5 inline-flex rounded-full p-0.5 text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text-secondary)]";

const bubbleClass =
  "pointer-events-none absolute right-0 top-full z-20 mt-1.5 w-max max-w-[min(260px,calc(100vw-3rem)))] rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] px-2.5 py-2 text-left font-body text-[11px] leading-snug tracking-[-0.01em] text-[var(--color-text-primary)] opacity-0 shadow-[var(--shadow-2)] transition-opacity duration-150 group-hover:opacity-100";

/**
 * Full explanation in a hover bubble; keeps price rows compact.
 * Use `tooltipOnly` inside `<a>` (e.g. MetalCard with `href`) — no nested button; native `title` as fallback.
 */
export function PriceHintIcon({ text, tooltipOnly = false }: { text: string; tooltipOnly?: boolean }) {
  return (
    <span className="group relative inline-flex shrink-0 align-middle">
      {tooltipOnly ? (
        <span
          title={text}
          aria-label={text}
          className={`${triggerClass} cursor-help`}
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.6} aria-hidden />
        </span>
      ) : (
        <button
          type="button"
          aria-label={text}
          className={`${triggerClass} focus-visible:ring-2 focus-visible:ring-[var(--color-border-primary)] focus-visible:ring-offset-1`}
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.6} aria-hidden />
        </button>
      )}
      <span role="tooltip" className={`${bubbleClass} ${tooltipOnly ? "" : "group-focus-within:opacity-100"}`}>
        {text}
      </span>
    </span>
  );
}
