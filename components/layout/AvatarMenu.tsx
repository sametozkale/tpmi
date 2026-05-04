"use client";

import { Avatar, Dropdown } from "@heroui/react";
import {
  PreferenceHorizontalIcon,
  Logout01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

function getInitials(
  displayName: string | null | undefined,
  email: string | null | undefined,
) {
  const name = displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (
        (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      );
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    const local = email.split("@")[0] ?? "";
    return (local.slice(0, 2) || "??").toUpperCase();
  }
  return "?";
}

function submitSignOut() {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/auth/signout";
  document.body.appendChild(form);
  form.submit();
}

export interface AvatarMenuProps {
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  /** Popover placement for the account menu */
  placement?: "bottom end" | "top start";
  /** Extra classes on the menu trigger button */
  triggerClassName?: string;
}

export function AvatarMenu(props: AvatarMenuProps) {
  const pathname = usePathname();
  return <AvatarMenuImpl key={pathname} {...props} />;
}

function AvatarMenuImpl({
  email,
  displayName,
  avatarUrl,
  placement = "bottom end",
  triggerClassName,
}: AvatarMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initials = getInitials(displayName, email);

  const itemClass = (active: boolean) =>
    cn(
      "rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] transition-colors duration-150 ease-in-out",
      active
        ? "bg-[#f2f2f2] text-[var(--color-text-primary)]"
        : "text-[var(--color-text-primary)] hover:bg-[#f2f2f2]",
    );

  return (
    <Dropdown isOpen={open} onOpenChange={setOpen}>
      <Dropdown.Trigger
        className={cn(
          "inline-flex min-h-0 min-w-0 items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[var(--color-border-active)]",
          triggerClassName,
        )}
        aria-label="Open account menu"
      >
        <Avatar color="accent" size="sm" variant="soft">
          {avatarUrl ? (
            <Avatar.Image alt="" src={avatarUrl} />
          ) : null}
          <Avatar.Fallback className="font-body text-[11px] font-medium">
            {initials}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover
        placement={placement}
        className="min-w-[200px] overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] shadow-[var(--shadow-2)]"
      >
        <Dropdown.Menu aria-label="Account" className="p-[4px] outline-none">
          <Dropdown.Section>
            <Dropdown.Item
              id="profile"
              textValue="Profile Settings"
              className={itemClass(
                pathname === "/profile" || pathname.startsWith("/profile/"),
              )}
              onAction={() => {
                router.push("/profile");
              }}
            >
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={UserCircleIcon} size={16} color="currentColor" strokeWidth={1.5} />
                <span>Profile Settings</span>
              </span>
            </Dropdown.Item>
            <Dropdown.Item
              id="preferences"
              textValue="Preferences"
              className={itemClass(
                pathname === "/preferences" ||
                  pathname.startsWith("/preferences/"),
              )}
              onAction={() => {
                router.push("/preferences");
              }}
            >
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={PreferenceHorizontalIcon} size={16} color="currentColor" strokeWidth={1.5} />
                <span>Preferences</span>
              </span>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Section>
            <Dropdown.Item
              id="signout"
              variant="danger"
              textValue="Log out"
              className="rounded-[10px] px-[10px] py-2 font-body text-[14px] tracking-[-0.01em] hover:bg-[#f2f2f2]"
              onAction={() => {
                submitSignOut();
              }}
            >
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                <span>Log out</span>
              </span>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
