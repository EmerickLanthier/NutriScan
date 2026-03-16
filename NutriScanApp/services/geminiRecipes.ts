export interface AIRecipe {
  id: string;
  title: string;
  shortDescription: string;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes?: number;
  servings?: number;
  healthReason?: string;
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

function buildPrompt(scannedFoodName: string, brand?: string, nutritionInfo?: string) {
  return `
Tu es un assistant de nutrition.
Génère 3 recettes santé UNIQUEMENT basées sur ce produit exact :
- Nom du produit : "${scannedFoodName}"${brand ? `\n- Marque : "${brand}"` : ""}${nutritionInfo ? `\n- Composition nutritionnelle : ${nutritionInfo}` : ""}

IMPORTANT : Les recettes doivent obligatoirement utiliser CE produit comme ingrédient principal. Ne génère pas de recettes génériques. Adapte toujours au produit exact scanné.

Contraintes :
- Les recettes doivent être réalistes, simples et saines
- Réponse en français
- Chaque recette doit contenir :
  - title
  - shortDescription
  - ingredients (tableau)
  - steps (tableau)
  - prepTimeMinutes
  - servings
  - healthReason
- Retourne uniquement du JSON valide
- Format exact :
{
  "recipes": [
    {
      "title": "string",
      "shortDescription": "string",
      "ingredients": ["string"],
      "steps": ["string"],
      "prepTimeMinutes": 10,
      "servings": 2,
      "healthReason": "string"
    }
  ]
}
`.trim();
}

export const generateRecipesFromGemini = async (
  scannedFoodName: string,
  brand?: string,
  nutritionInfo?: string
): Promise<AIRecipe[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Clé Gemini manquante");
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const body = {
    contents: [
      {
        parts: [
          {
            text: buildPrompt(scannedFoodName, brand, nutritionInfo),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(`${url}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini error ${response.status}: ${text}`);
  }

  const data = await response.json();

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Réponse Gemini invalide");
  }

  const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : [];

  return recipes.map((recipe: any, index: number) => ({
    id: `${Date.now()}-${index}`,
    title: String(recipe?.title ?? "Recette"),
    shortDescription: String(recipe?.shortDescription ?? ""),
    ingredients: Array.isArray(recipe?.ingredients)
      ? recipe.ingredients.map(String)
      : [],
    steps: Array.isArray(recipe?.steps)
      ? recipe.steps.map(String)
      : [],
    prepTimeMinutes:
      typeof recipe?.prepTimeMinutes === "number"
        ? recipe.prepTimeMinutes
        : undefined,
    servings:
      typeof recipe?.servings === "number" ? recipe.servings : undefined,
    healthReason: String(recipe?.healthReason ?? ""),
  }));
};