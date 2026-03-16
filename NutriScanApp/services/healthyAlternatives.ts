// services/healthyAlternatives.ts
export type NutriScoreLetter = "a" | "b" | "c" | "d" | "e" | "unknown";

export type AlternativeProduct = {
  code: string;
  name: string;
  brand?: string;
  nutriScore: NutriScoreLetter;
  imageUrl?: string;
  categories?: string[];
};

export async function fetchHealthyAlternatives(params: {
  categoryTag?: string | null;
  queryTextFallback?: string;
  pageSize?: number;
  scoreThreshold?: NutriScoreLetter;  
}): Promise<AlternativeProduct[]> {
  const pageSize = params.pageSize ?? 20;

//construire params + encoder (iOS safe)
const q: Record<string, string> = {
  search_simple: "1",
  action: "process",
  json: "1",
  page_size: String(pageSize),
  fields: [
    "code",
    "product_name",
    "brands",
    "nutriscore_grade",
    "nutrition_grade_fr",
    "image_front_small_url",
    "categories_tags",
  ].join(","),
};

if (params.categoryTag && params.categoryTag.trim().length > 0) {
  q.tagtype_0 = "categories";
  q.tag_contains_0 = "contains";
  q.tag_0 = params.categoryTag.trim();
  // Ne PAS combiner avec search_terms — trop restrictif, retourne 0 résultats
} else {
  q.search_terms = (params.queryTextFallback ?? "produit").trim();
}

const query = Object.entries(q)
  .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  .join("&");

const url = `https://world.openfoodfacts.org/cgi/search.pl?${query}`;

console.log("ALT FETCH URL:", url);

const res = await fetch(url);

  if (!res.ok) throw new Error(`OFF search failed: ${res.status}`);

  const data = await res.json();
  const products = Array.isArray(data?.products) ? data.products : [];

  const mapped: AlternativeProduct[] = products
    .map((p: any) => {
      const raw = String(
        p?.nutriscore_grade ?? p?.nutrition_grade_fr ?? ""
      ).toLowerCase();

      const nutriScore: NutriScoreLetter =
        raw === "a" || raw === "b" || raw === "c" || raw === "d" || raw === "e"
          ? (raw as NutriScoreLetter)
          : "unknown";

      return {
        code: String(p?.code ?? ""),
        name: String(p?.product_name ?? "Produit"),
        brand: p?.brands ? String(p.brands) : undefined,
        nutriScore,
        imageUrl: p?.image_front_small_url
          ? String(p.image_front_small_url)
          : undefined,
            categories: Array.isArray(p?.categories_tags) ? p.categories_tags : [],
      };
    })
    // Filtrer les produits avec NutriScore A/B/C
    .filter(
      (p: AlternativeProduct) =>
        p.code &&
        (p.nutriScore === "a" || p.nutriScore === "b" || p.nutriScore === "c")&&
        !p.categories?.some(cat =>
        cat.includes("water") || cat.includes("waters") || cat.includes("eaux") || cat.includes("eau")
      )
    )

  // Prioriser A puis B puis C
  const rank = (s: NutriScoreLetter) => (s === "a" ? 0 : s === "b" ? 1 : 2);
  mapped.sort((x, y) => rank(x.nutriScore) - rank(y.nutriScore));

  // Dédupe par nom de produit et marque
  const seen = new Set<string>();
  return mapped.filter((p: AlternativeProduct) => {
    const key = `${p.name}|${p.brand ?? ""}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}