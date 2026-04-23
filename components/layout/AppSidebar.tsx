"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@heroui/react";
import {
  GridViewIcon,
  PieChart01Icon,
  Settings02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { TpmiLogo } from "./TpmiLogo";

const links = [
  { href: "/holdings", label: "Portfolio", icon: PieChart01Icon },
  { href: "/dashboard", label: "Watchlist", icon: GridViewIcon },
  { href: "/transactions", label: "Transactions", icon: Wallet01Icon },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", onPointerDown);
    }
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[var(--layout-sidebar-width)] flex-col border-r border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] lg:flex"
      aria-label="Sidebar"
    >
      <div
        className="flex h-[var(--layout-header-height)] items-center border-b border-[var(--color-border-primary)] px-6"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center"
          aria-label="Go to dashboard"
        >
          <TpmiLogo />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-[14px] px-3 py-2 font-body text-[14px] font-normal tracking-[-0.01em] transition-all duration-150 ease-in-out ${
                active
                  ? "bg-[var(--color-background-elevation)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <HugeiconsIcon
                icon={link.icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border-primary)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open account menu"
              className="inline-flex items-center justify-center p-0 transition-all duration-150 ease-in-out hover:opacity-85"
            >
              <Avatar color="accent" size="sm" variant="soft">
                <Avatar.Image src="/blue-holistic-avatar.svg" alt="Profile avatar" />
                <Avatar.Fallback />
              </Avatar>
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute bottom-12 left-0 w-36 rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-1 shadow-[var(--shadow-2)]"
              >
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    role="menuitem"
                    className="w-full rounded-[10px] px-3 py-2 text-left font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-primary)] transition-all duration-150 ease-in-out hover:bg-[var(--color-hover-tertiary)]"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/settings"
              aria-label="Go to settings"
              className={`inline-flex items-center justify-center bg-transparent p-0 text-[var(--color-text-tertiary)] transition-colors duration-150 ease-in-out hover:bg-transparent hover:text-[var(--color-text-primary)] ${
                pathname === "/settings" || pathname.startsWith("/settings/")
                  ? "text-[var(--color-text-primary)]"
                  : ""
              }`}
            >
              <HugeiconsIcon
                icon={Settings02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
