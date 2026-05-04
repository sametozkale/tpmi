import { METAL_DETAILS, isMetalSymbol } from "@/lib/metals";
import { createClient } from "@/lib/supabase/server";
import { mapTransactionFromDbRow } from "@/lib/transactions/map-db-row";
import type { CreateTransactionInput } from "@/types/transactions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTransactionSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  executedAt: z.string().datetime(),
  note: z.string().trim().max(120),
  status: z.enum(["completed", "pending"]).optional().default("completed"),
});

function makeTxId(dateIso: string) {
  const d = new Date(dateIso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const suffix = Math.floor(100 + Math.random() * 900);
  return `TX-${y}${m}${day}-${suffix}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "tx_id, metal_name, symbol, side, quantity, unit_price, total_value, executed_at, status, note",
    )
    .eq("user_id", user.id)
    .order("executed_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to load transactions",
        details: error.message,
        code: error.code ?? null,
        hint: error.hint ?? null,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      transactions: (data ?? []).map(mapTransactionFromDbRow),
    },
    {
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    },
  );
}

export async function POST(request: Request) {
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

  const parsed = createTransactionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const payload = parsed.data as CreateTransactionInput & { symbol: string };
  const symbol = payload.symbol.toUpperCase();
  if (!isMetalSymbol(symbol)) {
    return NextResponse.json({ error: "Unknown symbol" }, { status: 400 });
  }

  const metal = METAL_DETAILS[symbol];
  const total = Number((payload.quantity * payload.unitPrice).toFixed(2));
  const txId = makeTxId(payload.executedAt);

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      tx_id: txId,
      metal_name: metal.name,
      symbol,
      side: payload.side,
      quantity: payload.quantity,
      unit_price: payload.unitPrice,
      total_value: total,
      executed_at: payload.executedAt,
      status: payload.status,
      note: payload.note || "Manual entry",
    })
    .select(
      "tx_id, metal_name, symbol, side, quantity, unit_price, total_value, executed_at, status, note",
    )
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        error: "Failed to save transaction",
        details: error?.message ?? "Unknown DB error",
        code: error?.code ?? null,
        hint: error?.hint ?? null,
      },
      { status: 500 },
    );
  }

  revalidatePath("/transactions");
  revalidatePath("/portfolio");

  return NextResponse.json({
    ok: true,
    transaction: mapTransactionFromDbRow(data),
  });
}
