"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  GridViewIcon,
  PieChart01Icon,
  Settings02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { TpmiLogo } from "./TpmiLogo";

const links = [
  { href: "/portfolio", label: "Portfolio", icon: PieChart01Icon },
  { href: "/watchlist", label: "Watchlist", icon: GridViewIcon },
  { href: "/transactions", label: "Transactions", icon: Wallet01Icon },
] as const;

export interface AppSidebarProps {
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export function AppSidebar({
  email,
  displayName,
  avatarUrl,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[var(--layout-sidebar-width)] flex-col border-r border-[var(--color-border-primary)] !bg-[#fafafa] lg:flex"
      style={{ backgroundColor: "#fafafa" }}
      aria-label="Sidebar"
    >
      <div
        className="flex h-[var(--layout-header-height)] items-center border-b border-[var(--color-border-primary)] px-6"
      >
        <Link
          href="/portfolio"
          className="inline-flex items-center"
          aria-label="Go to portfolio"
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
                  ? "bg-[#f2f2f2] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              } hover:bg-[#f2f2f2]`}
            >
              <HugeiconsIcon
                icon={link.icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--color-border-primary)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <AvatarMenu
            email={email}
            displayName={displayName}
            avatarUrl={avatarUrl}
            placement="top start"
          />
          <div className="ml-auto flex items-center gap-3">
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
