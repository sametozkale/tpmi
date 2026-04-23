import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  ProgressBar,
} from "@heroui/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { CurrencySelector } from "@/components/prices/CurrencySelector";
import { MetalCard } from "@/components/prices/MetalCard";
import { PortfolioLivePanel } from "@/components/portfolio/PortfolioLivePanel";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ToastPlayground } from "@/components/ui/ToastPlayground";
import { METAL_DETAILS } from "@/lib/metals";

const portfolioInstruments = [
  { name: "Gold", symbol: "XAU", price: 2345.67, quantity: 0.72 },
  { name: "Silver", symbol: "XAG", price: 29.84, quantity: 6.55 },
  { name: "Platinum", symbol: "XPT", price: 978.5, quantity: 0.15 },
];

const COLOR_SWATCHES: { label: string; varName: string }[] = [
  { label: "Background", varName: "--color-background" },
  { label: "Paper", varName: "--color-background-paper" },
  { label: "Elevation", varName: "--color-background-elevation" },
  { label: "Light elevation", varName: "--color-background-light-elevation" },
  { label: "Card", varName: "--color-background-card" },
  { label: "Inverted", varName: "--color-background-inverted" },
  { label: "Button primary", varName: "--color-button-primary" },
  { label: "Button secondary", varName: "--color-button-secondary" },
  { label: "Text primary", varName: "--color-text-primary" },
  { label: "Text secondary", varName: "--color-text-secondary" },
  { label: "Text tertiary", varName: "--color-text-tertiary" },
  { label: "Text quaternary", varName: "--color-text-quaternary" },
  { label: "Text link", varName: "--color-text-link" },
  { label: "Text positive", varName: "--color-text-positive" },
  { label: "Text negative", varName: "--color-text-negative" },
  { label: "Text critical", varName: "--color-text-critical" },
  { label: "Border primary", varName: "--color-border-primary" },
  { label: "Border secondary", varName: "--color-border-secondary" },
  { label: "Border soft", varName: "--color-border-soft" },
  { label: "Border active", varName: "--color-border-active" },
  { label: "Success tint", varName: "--color-background-success" },
  { label: "Warning tint", varName: "--color-background-warning" },
  { label: "Negative tint", varName: "--color-background-negative-tint" },
  { label: "Accent gold", varName: "--color-accent-gold" },
  { label: "Accent gold light", varName: "--color-accent-gold-light" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-body text-[16px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
          {title}
        </h2>
        <div
          className="mt-3 h-px w-full bg-[var(--color-border-soft)]"
          aria-hidden
        />
      </div>
      <div>{children}</div>
    </section>
  );
}

function Swatch({ label, varName }: { label: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-14 w-full rounded-[10px] border border-[var(--color-border-primary)] shadow-[var(--shadow-1)]"
        style={{ background: `var(${varName})` }}
      />
      <p className="font-body text-[12px] leading-snug tracking-[-0.01em] text-[var(--color-text-primary)]">
        {label}
      </p>
      <p className="font-body text-[11px] leading-snug tracking-[-0.01em] text-[var(--color-text-tertiary)]">
        {varName}
      </p>
    </div>
  );
}

function AvatarShapeSet({ size }: { size: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? 12 : size === "md" ? 16 : 20;

  return (
    <div className="flex h-full w-full items-center justify-center text-[var(--color-button-primary)]">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M6 0C4.34314 0 3 1.34316 3 3C1.34314 3 0 4.34316 0 6C0 7.65684 1.34314 9 3 9C3 10.6568 4.34314 12 6 12C7.65686 12 9 10.6568 9 9C10.6569 9 12 7.65684 12 6C12 4.34316 10.6569 3 9 3C9 1.34316 7.65686 0 6 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function PlaygroundPage() {
  const xau = METAL_DETAILS.XAU;
  const xag = METAL_DETAILS.XAG;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-[var(--layout-padding-horizontal)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-[72px] space-y-2">
          <h1 className="font-title text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
            Playground
          </h1>
          <p className="max-w-2xl font-body text-[15px] leading-relaxed tracking-[-0.01em] text-[var(--color-text-secondary)]">
            Internal design reference: shared components, typography, tokens, and
            surfaces as they exist in code. Edit source components and{" "}
            <code className="rounded bg-[var(--color-background-elevation)] px-1.5 py-0.5 font-mono text-[13px]">
              globals.css
            </code>{" "}
            to propagate changes across the product.
          </p>
        </header>

        <div className="flex flex-col gap-[72px]">
          <Section title="Typography">
            <div className="space-y-6">
              <div>
                <p className="mb-2 font-body text-[12px] uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  font-title
                </p>
                <p className="font-title text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
                  Title 30 / medium
                </p>
                <p className="mt-2 font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
                  Title 24 / medium
                </p>
                <p className="mt-2 font-title text-[18px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
                  Title 18 / medium
                </p>
              </div>
              <div>
                <p className="mb-2 font-body text-[12px] uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  font-body
                </p>
                <p className="font-body text-[15px] leading-relaxed tracking-[-0.01em] text-[#323232]">
                  Body 15 — Used for descriptions and UI copy. Letter-spacing -0.01em.
                </p>
                <p className="mt-2 font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  Body 14 secondary tone for supporting text.
                </p>
                <p className="mt-2 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                  Body 12 tertiary / captions
                </p>
              </div>
            </div>
          </Section>

          <Section title="Color system">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {COLOR_SWATCHES.map((item) => (
                <Swatch
                  key={item.varName}
                  label={item.label}
                  varName={item.varName}
                />
              ))}
            </div>
          </Section>

          <Section title="Layout">
            <div className="rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-4 font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
              <p className="font-medium text-[var(--color-text-primary)]">
                Layout tokens
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-[12px] text-[var(--color-text-tertiary)]">
                <li>--layout-padding-horizontal: 32px</li>
                <li>--layout-sidebar-width: 240px</li>
                <li>--layout-header-height: 56px</li>
                <li>--mobile-bottom-navbar-height: 64px</li>
              </ul>
            </div>
          </Section>

          <Section title="Shadows">
            <div className="flex flex-wrap gap-4">
              <div className="flex h-20 w-28 items-center justify-center rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-center font-body text-[11px] text-[var(--color-text-tertiary)] shadow-[var(--shadow-0)]">
                shadow-0
              </div>
              <div className="flex h-20 w-28 items-center justify-center rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-center font-body text-[11px] text-[var(--color-text-tertiary)] shadow-[var(--shadow-1)]">
                shadow-1
              </div>
              <div className="flex h-20 w-28 items-center justify-center rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-center font-body text-[11px] text-[var(--color-text-tertiary)] shadow-[var(--shadow-2)]">
                shadow-2
              </div>
              <div className="flex h-20 w-28 items-center justify-center rounded-[10px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-center font-body text-[11px] text-[var(--color-text-tertiary)] shadow-[var(--shadow-3)]">
                shadow-3
              </div>
            </div>
          </Section>

          <Section title="Button">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-16 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                  Small
                </span>
                <Button
                  type="button"
                  variant="primary"
                  className="h-[28px] rounded-[10px] px-3 font-body text-[13px] font-medium tracking-[-0.015em]"
                >
                  Primary
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-[28px] rounded-[10px] bg-[var(--color-background-elevation)] px-3 font-body text-[13px] font-medium tracking-[-0.015em] text-[#777] hover:bg-[var(--color-hover-secondary)]"
                >
                  Secondary
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="w-16 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                  Medium
                </span>
                <Button
                  type="button"
                  variant="primary"
                  className="h-[34px] rounded-[12px] px-4 font-body text-[14px] font-medium tracking-[-0.015em]"
                >
                  Primary
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-[34px] rounded-[12px] bg-[var(--color-background-elevation)] px-4 font-body text-[14px] font-medium tracking-[-0.015em] text-[#777] hover:bg-[var(--color-hover-secondary)]"
                >
                  Secondary
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="w-16 font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]">
                  Large
                </span>
                <Button
                  type="button"
                  variant="primary"
                  className="h-10 rounded-[14px] px-5 font-body text-[15px] font-medium tracking-[-0.015em]"
                >
                  Primary
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 rounded-[14px] bg-[var(--color-background-elevation)] px-5 font-body text-[15px] font-medium tracking-[-0.015em] text-[#777] hover:bg-[var(--color-hover-secondary)]"
                >
                  Secondary
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Avatar">
            <div className="flex items-center gap-4">
              <Avatar color="accent" size="sm" variant="soft">
                <Avatar.Fallback className="p-0 text-transparent">
                  <AvatarShapeSet size="sm" />
                </Avatar.Fallback>
              </Avatar>
              <Avatar color="accent" size="md" variant="soft">
                <Avatar.Fallback className="p-0 text-transparent">
                  <AvatarShapeSet size="md" />
                </Avatar.Fallback>
              </Avatar>
              <Avatar color="accent" size="lg" variant="soft">
                <Avatar.Fallback className="p-0 text-transparent">
                  <AvatarShapeSet size="lg" />
                </Avatar.Fallback>
              </Avatar>
            </div>
          </Section>

          <Section title="ThemeToggle">
            <ThemeToggle />
          </Section>

          <Section title="ThemeSwitch">
            <div className="flex items-center gap-3">
              <span className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                Dark mode
              </span>
              <ThemeSwitch />
            </div>
          </Section>

          <Section title="Input">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                  htmlFor="pg-input-email"
                >
                  Email
                </label>
                <input
                  id="pg-input-email"
                  type="email"
                  placeholder="name@company.com"
                  className="tpmi-input"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                  htmlFor="pg-input-password"
                >
                  Password
                </label>
                <PasswordInput
                  id="pg-input-password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                  htmlFor="pg-input-number"
                >
                  Number
                </label>
                <input
                  id="pg-input-number"
                  type="number"
                  placeholder="0"
                  className="tpmi-input"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                  htmlFor="pg-input-search"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    id="pg-input-search"
                    type="search"
                    placeholder="Search metals"
                    className="peer tpmi-input pr-10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)] transition-colors duration-150 peer-focus:text-[var(--color-text-primary)]">
                    <HugeiconsIcon icon={Search01Icon} size={18} />
                  </span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label
                  className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                  htmlFor="pg-input-date"
                >
                  Date
                </label>
                <div className="relative max-w-xs">
                  <input
                    id="pg-input-date"
                    type="date"
                    className="peer tpmi-input tpmi-input--date pr-10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-tertiary)] transition-colors duration-150 peer-focus:text-[var(--color-text-primary)]">
                    <HugeiconsIcon icon={Calendar03Icon} size={18} />
                  </span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="CurrencySelector">
            <div className="max-w-xs">
              <CurrencySelector />
            </div>
          </Section>

          <Section title="MetalCard">
            <div className="grid gap-4 md:grid-cols-2">
              <MetalCard
                symbol={xau.symbol}
                name={xau.name}
                price={xau.price}
                change={xau.change}
                changePct={xau.changePct}
                currency="USD"
              />
              <MetalCard
                symbol={xag.symbol}
                name={xag.name}
                price={xag.price}
                change={xag.change}
                changePct={xag.changePct}
                currency="USD"
              />
            </div>
          </Section>

          <Section title="PortfolioLivePanel">
            <PortfolioLivePanel instruments={portfolioInstruments} />
          </Section>

          <Section title="Surfaces & auth primitives">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-background-card)] p-5 shadow-[var(--shadow-1)] transition-shadow duration-150 hover:shadow-[var(--shadow-2)]">
                <p className="font-title text-[18px] font-medium tracking-[-0.01em] text-[var(--color-text-primary)]">
                  Card surface
                </p>
                <p className="mt-2 font-body text-[14px] leading-relaxed tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  16px radius, border-primary, shadow-1 → hover shadow-2.
                </p>
              </div>
              <div className="tpmi-page-paper rounded-[16px] border border-[var(--color-border-primary)] p-5">
                <p className="font-body text-[14px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                  Paper background utility{" "}
                  <code className="font-mono text-[12px] text-[var(--color-text-tertiary)]">
                    .tpmi-page-paper
                  </code>
                </p>
              </div>
              <div className="lg:col-span-2">
                <label className="tpmi-label" htmlFor="pg-demo-input">
                  Label + input
                </label>
                <input
                  id="pg-demo-input"
                  type="text"
                  placeholder="Placeholder"
                  className="tpmi-input"
                  readOnly
                  defaultValue="Sample value"
                />
                <div className="tpmi-divider-or">or</div>
                <p className="tpmi-success-banner">
                  Success / info banner pattern (
                  <code className="font-mono text-[12px]">.tpmi-success-banner</code>
                  )
                </p>
                <p className="tpmi-error mt-3" role="presentation">
                  Error text pattern ( .tpmi-error )
                </p>
                <p className="mt-4 font-body text-[14px] tracking-[-0.01em]">
                  <a className="tpmi-link" href="/sign-in">
                    Link style (.tpmi-link)
                  </a>
                </p>
              </div>
            </div>
          </Section>

          <Section title="HeroUI additional · Checkbox">
            <Checkbox defaultSelected>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>Enable alerts</Checkbox.Content>
            </Checkbox>
          </Section>

          <Section title="HeroUI additional · Chip">
            <Chip color="warning" variant="soft">
              Preview
            </Chip>
          </Section>

          <Section title="HeroUI additional · ProgressBar">
            <div className="max-w-md">
              <ProgressBar aria-label="Portfolio completion" value={65}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[13px] tracking-[-0.01em] text-[var(--color-text-secondary)]">
                      Portfolio completion
                    </span>
                    <ProgressBar.Output className="font-body text-[12px] tracking-[-0.01em] text-[var(--color-text-tertiary)]" />
                  </div>
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </div>
              </ProgressBar>
            </div>
          </Section>

          <Section title="Toast messages">
            <ToastPlayground />
          </Section>
        </div>
      </div>
    </div>
  );
}
