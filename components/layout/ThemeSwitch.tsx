"use client";

import { Switch } from "@heroui/react";
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

export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");
  const isDark = theme === "dark";

  const handleToggle = useCallback((selected: boolean) => {
    const nextTheme: ThemeMode = selected ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.cookie = `${STORAGE_KEY}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // ignore
    }
  }, []);

  return (
    <Switch
      aria-label="Toggle dark mode"
      isSelected={isDark}
      onChange={handleToggle}
      className="inline-flex w-auto max-w-fit data-[selected=true]:text-[var(--color-text-primary)] [--switch-control-bg-checked:var(--color-text-positive)] [--switch-control-bg-checked-hover:color-mix(in_oklab,var(--color-text-positive),black_10%)]"
      size="sm"
    >
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
  );
}
