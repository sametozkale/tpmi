"use client";

import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`tpmi-input pr-10 ${className ?? ""}`.trim()}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center justify-center text-[var(--color-text-tertiary)] opacity-0 transition-all duration-150 hover:text-[var(--color-text-secondary)] group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} size={18} />
      </button>
    </div>
  );
}
