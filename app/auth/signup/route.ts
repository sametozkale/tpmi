import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getSiteUrl(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password) {
    return NextResponse.redirect(new URL("/sign-up?error=missing_fields", request.url));
  }

  if (password !== confirm) {
    return NextResponse.redirect(new URL("/sign-up?error=password_mismatch", request.url));
  }

  const supabase = await createClient();
  const origin = getSiteUrl(request);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: displayName ? { display_name: displayName } : undefined,
    },
  });

  const target = error
    ? `/sign-up?error=${encodeURIComponent(error.message)}`
    : "/sign-up?success=check_email";
  return NextResponse.redirect(new URL(target, request.url));
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const origin = getSiteUrl(request);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  const target = error
    ? `/sign-up?error=${encodeURIComponent(error.message)}`
    : data.url || "/sign-up?error=oauth_start_failed";

  return NextResponse.redirect(new URL(target, request.url));
}
