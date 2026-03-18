export type NutriScoreLetter = "a" | "b" | "c" | "d" | "e" | "unknown";

export type Nutriments = {
  energyKcal_100g?: number;
  fat_100g?: number;
  saturatedFat_100g?: number;
  carbs_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
};

export type ProductQuality = {
  nutriScore: NutriScoreLetter;
  nutrients: Nutriments;
};

const toNumber = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

export function extractProductQuality(product: any): ProductQuality {
  const nutriScoreRaw = String(product?.nutriscore_grade ?? "").toLowerCase();
  const nutriScore: NutriScoreLetter =
    nutriScoreRaw === "a" || nutriScoreRaw === "b" || nutriScoreRaw === "c" || nutriScoreRaw === "d" || nutriScoreRaw === "e"
      ? (nutriScoreRaw as NutriScoreLetter)
      : "unknown";

  const n = product?.nutriments ?? {};
  const nutrients: Nutriments = {
    energyKcal_100g: toNumber(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? n["energy-kcal_value"]),
    fat_100g: toNumber(n["fat_100g"]),
    saturatedFat_100g: toNumber(n["saturated-fat_100g"]),
    carbs_100g: toNumber(n["carbohydrates_100g"]),
    sugars_100g: toNumber(n["sugars_100g"]),
    fiber_100g: toNumber(n["fiber_100g"]),
    proteins_100g: toNumber(n["proteins_100g"]),
    salt_100g: toNumber(n["salt_100g"]),
  };

  return { nutriScore, nutrients };
}
