import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AIRecipe } from "./geminiRecipes";

const FAVORITES_KEY = "favorite_recipes";

export const getFavoriteRecipes = async (): Promise<AIRecipe[]> => {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AIRecipe[];
  } catch {
    return [];
  }
};

export const saveFavoriteRecipes = async (recipes: AIRecipe[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(recipes));
};

export const addRecipeToFavorites = async (recipe: AIRecipe): Promise<void> => {
  const existing = await getFavoriteRecipes();
  const alreadyExists = existing.some((r) => r.id === recipe.id);

  if (alreadyExists) return;

  await saveFavoriteRecipes([...existing, recipe]);
};

export const removeRecipeFromFavorites = async (recipeId: string): Promise<void> => {
  const existing = await getFavoriteRecipes();
  const updated = existing.filter((r) => r.id !== recipeId);
  await saveFavoriteRecipes(updated);
};

export const isRecipeFavorite = async (recipeId: string): Promise<boolean> => {
  const existing = await getFavoriteRecipes();
  return existing.some((r) => r.id === recipeId);
};