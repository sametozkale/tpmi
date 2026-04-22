const MISSING_ENV_ERROR =
  "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseEnvOrThrow() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(MISSING_ENV_ERROR);
  }
  return env;
}
