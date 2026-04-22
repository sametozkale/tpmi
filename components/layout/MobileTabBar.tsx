"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  GridViewIcon,
  PieChart01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/holdings", label: "Portfolio", icon: PieChart01Icon },
  { href: "/dashboard", label: "Watchlist", icon: GridViewIcon },
  { href: "/settings", label: "Settings", icon: Settings02Icon },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--mobile-bottom-navbar-height)] items-stretch border-t border-[var(--color-border-primary)] bg-[var(--color-background-card)] px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-2 font-body text-[11px] font-medium tracking-[-0.01em] transition-all duration-150 ease-in-out ${
              active
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-tertiary)]"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 ease-in-out ${
                active ? "bg-[var(--color-background-elevation)]" : ""
              }`}
            >
              <HugeiconsIcon
                icon={tab.icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
