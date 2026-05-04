import { gramsToTroyOz } from "@/lib/units/precious-metal";

/**
 * Turkish Republic gold coin fine gold weights (common industry references, grams).
 * Stored quantities remain troy oz for API consistency with XAU spot (/oz).
 */
export const TR_GOLD_FINE_GRAMS = {
  ceyrek: 1.754,
  yarim: 3.508,
  tam: 7.016,
} as const;

export type TurkishGoldPresetId = keyof typeof TR_GOLD_FINE_GRAMS;

export interface TurkishGoldPresetOption {
  id: TurkishGoldPresetId;
  label: string;
  fineGrams: number;
  troyOz: number;
}

export function getTurkishGoldPresetOptions(): TurkishGoldPresetOption[] {
  return (
    [
      { id: "tam", label: "Tam", fineGrams: TR_GOLD_FINE_GRAMS.tam },
      { id: "yarim", label: "Yarım", fineGrams: TR_GOLD_FINE_GRAMS.yarim },
      { id: "ceyrek", label: "Çeyrek", fineGrams: TR_GOLD_FINE_GRAMS.ceyrek },
    ] as const
  ).map((row) => ({
    ...row,
    troyOz: gramsToTroyOz(row.fineGrams),
  }));
}

export function formatTroyOzForInput(value: number): string {
  return value.toFixed(6).replace(/\.?0+$/, "") || "0";
}

const PRESET_EN_LABEL: Record<TurkishGoldPresetId, string> = {
  tam: "Full",
  yarim: "Half",
  ceyrek: "Quarter",
};

/** Auto note when user leaves note empty (English, matches app copy). */
export function formatTurkishGoldPresetAutoNoteEnglish(
  kind: TurkishGoldPresetId,
  count: number,
): string {
  const label = PRESET_EN_LABEL[kind];
  const n = Math.max(1, Math.floor(count));
  return n === 1 ? `${label} (Cumhuriyet)` : `${n} × ${label} (Cumhuriyet)`;
}
