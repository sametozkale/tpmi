import { SignInView } from "@/components/auth/SignInView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return <SignInView error={error} />;
}
