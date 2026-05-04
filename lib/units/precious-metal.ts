/** Troy ounce mass in grams (international avoirdupois definition for precious metals). */
export const GRAMS_PER_TROY_OZ = 31.1034768;

export function gramsToTroyOz(grams: number): number {
  return grams / GRAMS_PER_TROY_OZ;
}

export function troyOzToGrams(troyOz: number): number {
  return troyOz * GRAMS_PER_TROY_OZ;
}
