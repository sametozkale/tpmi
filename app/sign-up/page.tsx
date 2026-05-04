import { SignUpView } from "@/components/auth/SignUpView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return <SignUpView error={error} success={success} />;
}
