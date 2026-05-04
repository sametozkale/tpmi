import { MetalMarketDetailView } from "@/components/markets/MetalMarketDetailView";
import { METAL_DETAILS, isMetalSymbol } from "@/lib/metals";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MetalDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  if (!isMetalSymbol(upperSymbol)) {
    notFound();
  }

  const detail = METAL_DETAILS[upperSymbol];

  return (
    <div className="flex flex-col gap-2">
      <MetalMarketDetailView detail={detail} />
    </div>
  );
}
