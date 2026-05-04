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

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const target = error
    ? `/sign-in?error=${encodeURIComponent(error.message)}`
    : "/watchlist";
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
    ? `/sign-in?error=${encodeURIComponent(error.message)}`
    : data.url || "/sign-in?error=oauth_start_failed";

  return NextResponse.redirect(new URL(target, request.url));
}
