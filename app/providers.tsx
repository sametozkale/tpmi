"use client";

import type { ReactNode } from "react";

/**
 * HeroUI v3 does not require a global provider for basic components.
 * This wrapper exists for future providers (e.g. toast, analytics).
 */
export function Providers({ children }: { children: ReactNode }) {
  return children;
}
