import Link from "next/link";
import { AvatarMenu } from "@/components/layout/AvatarMenu";

export interface MobileHeaderProps {
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export function MobileHeader({
  email,
  displayName,
  avatarUrl,
}: MobileHeaderProps) {
  return (
    <header className="flex h-[var(--layout-header-height)] items-center justify-between border-b border-[var(--color-border-primary)] bg-[var(--color-background-light-elevation)] px-4 lg:hidden">
      <Link
        href="/holdings"
        className="font-title text-[18px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]"
      >
        <span className="text-[var(--color-text-primary)]">TP</span>
        <span className="text-[var(--color-accent-gold)]">M</span>
        <span className="text-[var(--color-text-primary)]">I</span>
      </Link>
      <div className="flex items-center gap-3">
        <AvatarMenu
          email={email}
          displayName={displayName}
          avatarUrl={avatarUrl}
          placement="bottom end"
        />
      </div>
    </header>
  );
}
