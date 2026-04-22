import {
  signUpWithGoogle,
  signUpWithPassword,
} from "@/app/actions/auth";
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
      <div className="tpmi-auth-card w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div
            className="font-title text-[24px] font-light leading-none tracking-[-0.02em]"
            aria-hidden
          >
            <span className="text-[var(--color-text-primary)]">TP</span>
            <span className="text-[var(--color-accent-gold)]">M</span>
            <span className="text-[var(--color-text-primary)]">I</span>
          </div>
          <h1 className="font-title text-[24px] font-light leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
            Create account
          </h1>
        </div>

        {success === "check_email" ? (
          <p className="tpmi-success-banner" role="status">
            Check your email to confirm your account before signing in.
          </p>
        ) : null}

        <form className="mt-6 flex flex-col gap-5" action={signUpWithPassword}>
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
              required
              className="tpmi-input"
            />
          </div>
          <div>
            <label className="tpmi-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="tpmi-input"
            />
          </div>
          <div>
            <label className="tpmi-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="tpmi-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-1 h-12 rounded-full px-6 font-body text-[15px] font-medium tracking-[-0.015em]"
          >
            Sign up
          </Button>
        </form>

        <div className="tpmi-divider-or">or</div>

        <form action={signUpWithGoogle}>
          <Button
            type="submit"
            variant="secondary"
            className="h-12 w-full rounded-full px-6 font-body text-[15px] font-medium tracking-[-0.015em]"
          >
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

        <p className="mt-8 text-center font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link className="tpmi-link" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
