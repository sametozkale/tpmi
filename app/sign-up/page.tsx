import {
  signUpWithGoogle,
  signUpWithPassword,
} from "@/app/actions/auth";
import { TpmiLogo } from "@/components/layout/TpmiLogo";
import { GoogleMark } from "@/components/ui/GoogleMark";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@heroui/react";
import Link from "next/link";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
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
  const success = params.success;

  return (
    <div className="tpmi-page-paper flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="tpmi-auth-card">
          <div className="mb-8 flex flex-col items-start gap-3 text-left">
            <TpmiLogo />
            <h1 className="font-title text-[24px] font-medium leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
              Create your TPMI account
            </h1>
          </div>

          {success === "check_email" ? (
            <p className="tpmi-success-banner mb-6" role="status">
              Check your email to confirm your account before signing in.
            </p>
          ) : null}

          <form className="flex flex-col gap-5" action={signUpWithPassword}>
            <div>
              <label className="tpmi-label" htmlFor="displayName">
                Full name{" "}
                <span className="text-[var(--color-text-tertiary)]">(optional)</span>
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className="tpmi-input"
              />
            </div>
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
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label
                className="block font-body text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-text-primary)]"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="mt-1 h-10 w-full rounded-[14px] px-5 font-body text-[15px] font-medium tracking-[-0.015em]"
            >
              Sign up
            </Button>
          </form>

          <div className="tpmi-divider-or">or</div>

          <form action={signUpWithGoogle}>
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
              {error === "password_mismatch"
                ? "Passwords do not match."
                : error === "missing_fields"
                  ? "Please fill in all required fields."
                  : error}
            </p>
          ) : null}
        </div>

        <p className="mt-8 text-center font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link className="tpmi-link text-[var(--color-button-primary)]" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
