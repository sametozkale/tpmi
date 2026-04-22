import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-full flex-1 bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <AppSidebar />
      <div className="flex min-h-full flex-1 flex-col lg:pl-[var(--layout-sidebar-width)]">
        <MobileHeader />
        <main className="flex-1 px-4 pb-[calc(var(--mobile-bottom-navbar-height)+24px)] pt-6 lg:px-[var(--layout-padding-horizontal)] lg:pb-12 lg:pt-10">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
