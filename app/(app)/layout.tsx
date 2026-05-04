import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PricesProvider } from "@/components/prices/PricesProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

function getAvatarMenuProps(user: User) {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const displayName =
    typeof meta?.full_name === "string"
      ? meta.full_name
      : typeof meta?.name === "string"
        ? meta.name
        : null;
  const avatarUrl =
    typeof meta?.avatar_url === "string" ? meta.avatar_url : null;
  return {
    email: user.email,
    displayName,
    avatarUrl,
  };
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const headerUser = getAvatarMenuProps(user);

  return (
    <div className="flex min-h-full flex-1 bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <AppSidebar {...headerUser} />
      <div className="flex min-h-full flex-1 flex-col lg:pl-[var(--layout-sidebar-width)]">
        <MobileHeader {...headerUser} />
        <main className="flex-1 px-4 pb-[calc(var(--mobile-bottom-navbar-height)+24px)] pt-6 lg:px-[72px] lg:pb-12 lg:pt-[48px]">
          <div className="mx-auto w-full max-w-[1200px]">
            <PricesProvider>{children}</PricesProvider>
          </div>
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
