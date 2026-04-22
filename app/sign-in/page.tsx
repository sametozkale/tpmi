import {
  signInWithGoogle,
  signInWithPassword,
} from "@/app/actions/auth";
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
            Sign in
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
              autoComplete="current-password"
              required
              className="tpmi-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-1 h-12 rounded-full px-6 font-body text-[15px] font-medium tracking-[-0.015em]"
          >
            Sign in
          </Button>
        </form>

        <div className="tpmi-divider-or">or</div>

        <form action={signInWithGoogle}>
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
            {error}
          </p>
        ) : null}

        <p className="mt-8 text-center font-body text-[14px] leading-snug tracking-[-0.01em] text-[var(--color-text-secondary)]">
          New to TPMI?{" "}
          <Link className="tpmi-link" href="/sign-up">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
