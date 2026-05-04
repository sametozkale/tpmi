import { METAL_DETAILS, isMetalSymbol } from "@/lib/metals";
import { createClient } from "@/lib/supabase/server";
import { mapTransactionFromDbRow } from "@/lib/transactions/map-db-row";
import type { UpdateTransactionInput } from "@/types/transactions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateTransactionSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  executedAt: z.string().datetime(),
  note: z.string().trim().max(120),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;
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

  const parsed = updateTransactionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const payload = parsed.data as UpdateTransactionInput & { symbol: string };
  const symbol = payload.symbol.toUpperCase();
  if (!isMetalSymbol(symbol)) {
    return NextResponse.json({ error: "Unknown symbol" }, { status: 400 });
  }

  const metal = METAL_DETAILS[symbol];
  const total = Number((payload.quantity * payload.unitPrice).toFixed(2));

  const { data, error } = await supabase
    .from("transactions")
    .update({
      metal_name: metal.name,
      symbol,
      side: payload.side,
      quantity: payload.quantity,
      unit_price: payload.unitPrice,
      total_value: total,
      executed_at: payload.executedAt,
      note: payload.note || "Manual entry",
    })
    .eq("user_id", user.id)
    .eq("tx_id", txId)
    .select(
      "tx_id, metal_name, symbol, side, quantity, unit_price, total_value, executed_at, status, note",
    )
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        error: "Failed to update transaction",
        details: error?.message ?? "Unknown DB error",
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;
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
    .delete()
    .eq("user_id", user.id)
    .eq("tx_id", txId)
    .select("tx_id");

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to delete transaction",
        details: error.message,
      },
      { status: 500 },
    );
  }

  if (!data?.length) {
    return NextResponse.json(
      { error: "Transaction not found", details: "No row deleted for this id." },
      { status: 404 },
    );
  }

  revalidatePath("/transactions");
  revalidatePath("/portfolio");

  return NextResponse.json(
    { ok: true, deletedId: txId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
