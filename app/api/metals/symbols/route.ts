import {
  DEFAULT_PRODUCT_SYMBOL_MAP,
  fetchProductSymbolMapFromMetalsApi,
} from "@/lib/metals-symbols";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const symbols = await fetchProductSymbolMapFromMetalsApi();
    return NextResponse.json({ ok: true, symbols });
  } catch {
    return NextResponse.json({ ok: true, symbols: DEFAULT_PRODUCT_SYMBOL_MAP });
  }
}
