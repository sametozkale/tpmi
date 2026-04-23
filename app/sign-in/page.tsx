import {
  signInWithGoogle,
  signInWithPassword,
} from "@/app/actions/auth";
import { TpmiLogo } from "@/components/layout/TpmiLogo";
import { GoogleMark } from "@/components/ui/GoogleMark";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@heroui/react";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const rawError = params.error;
  const error =
    rawError != null
      ? (() => {
          try {
            return decodeURIComponent(rawError);
          } catch {
            return rawError;
          }
        })()
      : undefined;

  return (
    <div className="tpmi-page-paper flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="tpmi-auth-card">
          <div className="mb-8 flex flex-col items-start gap-4 text-left">
            <TpmiLogo />
            <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
              Sign in to TPMI
            </h1>
          </div>

          <form className="flex flex-col gap-5" action={signInWithPassword}>
            <div>
              <label className="tpmi-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                required
                className="tpmi-input"
              />
            </div>
            <div>
              <label
                className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                htmlFor="password"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="mt-1 h-10 w-full rounded-[14px] px-5 font-body text-[15px] font-medium tracking-[-0.015em]"
            >
              Sign in
            </Button>
          </form>

          <div className="tpmi-divider-or">or</div>

          <form action={signInWithGoogle}>
            <Button
              type="submit"
              variant="secondary"
              className="h-10 w-full rounded-[14px] px-5 font-body text-[15px] font-medium tracking-[-0.015em] text-[#777] gap-2"
            >
              <GoogleMark />
              Continue with Google
            </Button>
          </form>

          {error ? (
            <p className="tpmi-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <p className="mt-8 text-center font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          New to TPMI?{" "}
          <Link className="tpmi-link text-[var(--color-button-primary)]" href="/sign-up">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
