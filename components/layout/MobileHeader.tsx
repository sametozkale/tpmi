import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function MobileHeader() {
  return (
    <header className="flex h-[var(--layout-header-height)] items-center justify-between border-b border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-4 lg:hidden">
      <Link
        href="/dashboard"
        className="font-title text-[18px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]"
      >
        <span className="text-[var(--color-text-primary)]">TP</span>
        <span className="text-[var(--color-accent-gold)]">M</span>
        <span className="text-[var(--color-text-primary)]">I</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
