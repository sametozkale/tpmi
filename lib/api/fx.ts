import { z } from "zod";

export interface FxRates {
  base: "USD";
  rates: Record<string, number>;
  fetchedAt: string;
}

const FX_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

const fxPayloadSchema = z.object({
  result: z.string().optional(),
  rates: z.record(z.string(), z.coerce.number().positive()),
});

export async function fetchFxRates(): Promise<FxRates> {
  const res = await fetch(FX_ENDPOINT, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`open.er-api.com returned ${res.status}`);
  }

  const json = await res.json();
  const parsed = fxPayloadSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("open.er-api.com payload invalid");
  }

  return {
    base: "USD",
    rates: parsed.data.rates,
    fetchedAt: new Date().toISOString(),
  };
}
