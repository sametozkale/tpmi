"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "tpmi_theme";

type ThemeMode = "light" | "dark";

function readTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return "light";
}

function subscribe(onStoreChange: () => void) {
  const el = document.documentElement;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("storage", onStoreChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStoreChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  const applyTheme = useCallback((next: ThemeMode) => {
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center bg-transparent p-0 text-[var(--color-text-tertiary)] transition-colors duration-150 ease-in-out hover:bg-transparent hover:text-[var(--color-text-primary)]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <HugeiconsIcon
        icon={isDark ? Sun01Icon : Moon02Icon}
        size={16}
        color="currentColor"
        strokeWidth={1.5}
      />
    </button>
  );
}
