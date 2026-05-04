import { createClient } from "@/lib/supabase/server";
import {
  USER_PREFERENCES_COOKIE,
  parseUserPreferencesCookie,
} from "@/lib/user-preferences-cookie";
import { userPreferencesSchema } from "@/lib/validation/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jar = await cookies();
  const preferences = parseUserPreferencesCookie(
    jar.get(USER_PREFERENCES_COOKIE)?.value,
  );

  return NextResponse.json({ ok: true, preferences });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = userPreferencesSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const jar = await cookies();
  jar.set(USER_PREFERENCES_COOKIE, JSON.stringify(parsed.data), {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({
    ok: true,
    preferences: parsed.data,
  });
}
