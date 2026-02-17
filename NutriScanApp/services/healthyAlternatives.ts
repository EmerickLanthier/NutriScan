// services/healthyAlternatives.ts
export type NutriScoreLetter = "a" | "b" | "c" | "d" | "e" | "unknown";

export type AlternativeProduct = {
  code: string;
  name: string;
  brand?: string;
  nutriScore: NutriScoreLetter;
  imageUrl?: string;
};

export async function fetchHealthyAlternatives(params: {
  categoryTag?: string | null;
  queryTextFallback?: string;
  pageSize?: number;
  scoreThreshold?: NutriScoreLetter;  
}): Promise<AlternativeProduct[]> {
  const pageSize = params.pageSize ?? 20;

  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", String(pageSize));

  // Recherche par catégorie
  if (params.categoryTag) {
    url.searchParams.set("tagtype_0", "categories");
    url.searchParams.set("tag_contains_0", "contains");
    url.searchParams.set("tag_0", params.categoryTag);
  } else {
    // Fallback sur nom produit
    url.searchParams.set("search_terms", params.queryTextFallback ?? "produit");
  }

  // Ajouter des champs pertinents
  url.searchParams.set(
    "fields",
    [
      "code",
      "product_name",
      "brands",
      "nutriscore_grade",
      "nutrition_grade_fr",
      "image_front_small_url",
    ].join(",")
  );

  const res = await fetch(url.toString());
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
      };
    })
    // Filtrer les produits avec NutriScore A/B/C
    .filter(
      (p: AlternativeProduct) =>
        p.code &&
        (p.nutriScore === "a" || p.nutriScore === "b" || p.nutriScore === "c")
    );

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
