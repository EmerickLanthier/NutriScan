export interface NutritionRowData {
  label: string;
  value: string;
  unit: string;
  bold?: boolean;
  subItem?: boolean;
  level?: "low" | "moderate" | "high" | null;
}

export interface ProductData {
  barcode: string;
  name: string;
  image: string | null;
  brands: string;
  quantity: string;
  labels: string[];
  nutriscore: string;
  nutritionRows: NutritionRowData[];
  categoryTag: string | null;
}

export const fetchProduct = async (barcode: string): Promise<ProductData | null> => {
  const cleanBarcode = String(barcode).trim().replace(/[^\d]/g, "");
  if (!cleanBarcode) return null;

  const fields = [
    "product_name",
    "product_name_fr",
    "brands",
    "quantity",
    "image_front_url",
    "image_url",
    "labels_tags",
    "nutriscore_grade",
    "nutriments",
    "nutrient_levels",
    "categories_tags",
  ].join(",");

  // IMPORTANT: essaie aussi le domaine SANS "world." (certaines configs iOS/proxy aiment moins)
  const urlA = `https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}?fields=${encodeURIComponent(fields)}`;
  const urlB = `https://openfoodfacts.org/api/v2/product/${cleanBarcode}?fields=${encodeURIComponent(fields)}`;

  const tryFetch = async (url: string) => {
    console.log("FETCH TRY:", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          // parfois utile pour éviter comportements bizarres côté serveur/proxy
          "Cache-Control": "no-cache",
        },
      });

      console.log("FETCH OK. status:", res.status, "finalURL:", (res as any)?.url);
      if (!res.ok) return null;

      const data: any = await res.json();
      return data?.product ?? null;
    } catch (e: any) {
      // iOS donne souvent juste "Network request failed" => on log plus agressif
      console.log("FETCH ERROR RAW:", e);
      console.log(
        "FETCH ERROR DETAILS:",
        JSON.stringify(e, Object.getOwnPropertyNames(e))
      );
      return null;
    }
  };

  const p = (await tryFetch(urlA)) ?? (await tryFetch(urlB));
  if (!p) return null;

  // ✅ SAFE init
  const rows: NutritionRowData[] = [];
  const n: Record<string, any> = (p?.nutriments ?? {}) as any;
  const levels: Record<string, any> = (p?.nutrient_levels ?? {}) as any;

  const fmt = (key: string, x: number) => (key === "energy-kcal" ? x.toFixed(0) : x.toFixed(1));

  const addRow = (
    key: string,
    label: string,
    unit: string,
    options: { bold?: boolean; subItem?: boolean; force?: boolean } = {}
  ) => {
    const raw = n[`${key}_100g`];
    if (raw !== undefined || options.force) {
      const num = typeof raw === "number" ? raw : Number(raw);
      const safeNum = Number.isFinite(num) ? num : 0;

      rows.push({
        label,
        value: fmt(key, safeNum),
        unit,
        bold: options.bold,
        subItem: options.subItem,
        level: (levels?.[key] as "low" | "moderate" | "high") ?? null,
      });
    }
  };

  addRow("energy-kcal", "Énergie", "kcal", { bold: true, force: true });
  addRow("fat", "Matières grasses", "g", { force: true });
  addRow("saturated-fat", "Dont acides gras saturés", "g", { subItem: true, force: true });
  addRow("carbohydrates", "Glucides", "g", { force: true });
  addRow("sugars", "Dont sucres", "g", { subItem: true, force: true });

  const fiberVal = Number(n["fiber_100g"] ?? 0);
  if (Number.isFinite(fiberVal) && fiberVal > 0.1) addRow("fiber", "Fibres alimentaires", "g");

  addRow("proteins", "Protéines", "g", { force: true });
  addRow("salt", "Sel", "g", { force: true });

  const sodiumVal = Number(n["sodium_100g"] ?? 0);
  if (Number.isFinite(sodiumVal) && sodiumVal > 0) addRow("sodium", "Sodium", "g");

  const categoryTag: string | null = Array.isArray(p.categories_tags)
    ? (p.categories_tags.find((t: any) => typeof t === "string" && t.startsWith("en:")) ?? null)
    : null;

  return {
    barcode: cleanBarcode,
    name: p.product_name_fr || p.product_name || "Produit inconnu",
    image: p.image_front_url || p.image_url || null,
    brands: p.brands || "Marque inconnue",
    quantity: p.quantity || "",
    labels: Array.isArray(p.labels_tags) ? p.labels_tags : [],
    nutriscore: p.nutriscore_grade || "?",
    nutritionRows: rows,
    categoryTag,
  };
};