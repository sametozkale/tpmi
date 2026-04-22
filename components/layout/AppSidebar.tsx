"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

const links = [
  { href: "/holdings", label: "Portfolio", icon: PieChart01Icon },
  { href: "/dashboard", label: "Watchlist", icon: GridViewIcon },
  { href: "/transactions", label: "Transactions", icon: Wallet01Icon },
] as const;

function TpmiLogo() {
  return (
    <svg
      width="77"
      height="20"
      viewBox="0 0 169 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TPMI logo"
    >
      <path d="M19.7722 0.140137C23.2326 0.140253 26.0378 2.94532 26.0378 6.40576C26.0377 9.86611 23.2326 12.6713 19.7722 12.6714C16.3118 12.6714 13.5067 9.86618 13.5066 6.40576C13.5066 2.94524 16.3117 0.140137 19.7722 0.140137Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path d="M19.7722 15.7349C23.2326 15.735 26.0378 18.54 26.0378 22.0005C26.0377 25.4608 23.2326 28.266 19.7722 28.2661C16.3118 28.2661 13.5067 25.4609 13.5066 22.0005C13.5066 18.54 16.3117 15.7349 19.7722 15.7349Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path opacity="0.5" d="M6.40527 7.9375C9.86569 7.93762 12.6709 10.7427 12.6709 14.2031C12.6708 17.6635 9.86562 20.4686 6.40527 20.4688C2.94483 20.4688 0.139762 17.6635 0.139648 14.2031C0.139648 10.7426 2.94476 7.9375 6.40527 7.9375Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path d="M6.40527 23.5327C9.86569 23.5328 12.6709 26.3379 12.6709 29.7983C12.6708 33.2587 9.86562 36.0638 6.40527 36.064C2.94483 36.064 0.139762 33.2588 0.139648 29.7983C0.139648 26.3378 2.94476 23.5327 6.40527 23.5327Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path opacity="0.5" d="M33.1394 7.9375C36.5998 7.93762 39.405 10.7427 39.405 14.2031C39.4049 17.6635 36.5998 20.4686 33.1394 20.4688C29.679 20.4688 26.8739 17.6635 26.8738 14.2031C26.8738 10.7426 29.6789 7.9375 33.1394 7.9375Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path d="M33.1394 23.5327C36.5998 23.5328 39.405 26.3379 39.405 29.7983C39.4049 33.2587 36.5998 36.0638 33.1394 36.064C29.679 36.064 26.8739 33.2588 26.8738 29.7983C26.8738 26.3378 29.6789 23.5327 33.1394 23.5327Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path opacity="0.5" d="M19.7722 31.3296C23.2326 31.3297 26.0378 34.1348 26.0378 37.5952C26.0377 41.0556 23.2326 43.8607 19.7722 43.8608C16.3118 43.8608 13.5067 41.0556 13.5066 37.5952C13.5066 34.1347 16.3117 31.3296 19.7722 31.3296Z" fill="#FB7E5E" stroke="#FB7E5E" strokeWidth="0.278481" />
      <path d="M57.3737 7.34233C57.3737 6.18253 58.0108 5.54545 59.1706 5.54545H82.2686C83.4284 5.54545 84.0655 6.18253 84.0655 7.34233V8.82883C84.0655 9.98864 83.4284 10.6257 82.2686 10.6257H73.7253V37.2031C73.7253 38.3629 73.0882 39 71.9284 39H69.5108C68.351 39 67.7139 38.3629 67.7139 37.2031V10.6257H59.1706C58.0108 10.6257 57.3737 9.98864 57.3737 8.82883V7.34233ZM88.7511 7.34233C88.7511 6.18253 89.3882 5.54545 90.548 5.54545H101.297C108.99 5.54545 113.091 10.2337 113.091 16.6207C113.091 23.0568 108.941 27.696 101.215 27.696H94.8115V37.2031C94.8115 38.3629 94.1744 39 93.0146 39H90.548C89.3882 39 88.7511 38.3629 88.7511 37.2031V7.34233ZM94.8115 22.7138H100.398C104.907 22.7138 106.916 20.1818 106.916 16.6207C106.916 13.0597 104.907 10.6094 100.365 10.6094H94.8115V22.7138ZM123.808 5.54545C124.837 5.54545 125.49 5.97017 125.883 6.93395L135.243 29.7869H135.635L144.995 6.93395C145.387 5.97017 146.04 5.54545 147.069 5.54545H151.186C152.346 5.54545 152.983 6.18253 152.983 7.34233V37.2031C152.983 38.3629 152.346 39 151.186 39H148.964C147.804 39 147.167 38.3629 147.167 37.2031V16.0163H146.857L138.183 37.4972C137.791 38.4446 137.138 38.902 136.108 38.902H134.769C133.74 38.902 133.07 38.4446 132.694 37.4972L124.02 15.9673H123.71V37.2031C123.71 38.3629 123.073 39 121.913 39H119.691C118.532 39 117.895 38.3629 117.895 37.2031V7.34233C117.895 6.18253 118.532 5.54545 119.691 5.54545H123.808ZM165.182 37.2031C165.182 38.3629 164.545 39 163.386 39H160.919C159.759 39 159.122 38.3629 159.122 37.2031V7.34233C159.122 6.18253 159.759 5.54545 160.919 5.54545H163.386C164.545 5.54545 165.182 6.18253 165.182 7.34233V37.2031Z" fill="#FB7E5E" />
    </svg>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => observer.disconnect();
    },
    () =>
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light",
    () => "light",
  );
  const isDark = theme === "dark";

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
      className={`fixed inset-y-0 left-0 z-30 hidden w-[var(--layout-sidebar-width)] flex-col bg-[var(--color-background-light-elevation)] lg:flex ${
        isDark ? "border-r border-[rgba(255,255,255,0.1)]" : "border-r border-[#eee]"
      }`}
      aria-label="Sidebar"
    >
      <div
        className={`flex h-[var(--layout-header-height)] items-center px-6 ${
          isDark ? "border-b border-[rgba(255,255,255,0.1)]" : "border-b border-[#eee]"
        }`}
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
                  ? isDark
                    ? "bg-[rgba(255,255,255,0.08)] text-[var(--color-text-primary)]"
                    : "bg-[#F6F1EA] text-[var(--color-text-primary)]"
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

      <div
        className={`mt-auto flex flex-col gap-3 p-4 ${
          isDark ? "border-t border-[rgba(255,255,255,0.1)]" : "border-t border-[#eee]"
        }`}
      >
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
