"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

/**
 * HeroUI v3 does not require a global provider for basic components.
 * This wrapper exists for future providers (e.g. toast, analytics).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton={false}
        toastOptions={{
          className:
            "!rounded-[12px] !border !border-[var(--color-border-primary)] !bg-[var(--color-background-card)] !text-[var(--color-text-primary)] !py-2.5",
          descriptionClassName:
            "!font-body !text-[12px] !tracking-[-0.01em] !text-[var(--color-text-secondary)]",
        }}
      />
    </>
  );
}
