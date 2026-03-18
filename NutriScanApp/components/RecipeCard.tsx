import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { AIRecipe } from "@/services/geminiRecipes";
import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  isRecipeFavorite,
} from "@/services/recipeStorage";

interface RecipeCardProps {
  recipe: AIRecipe;
  onOpenRecipe: (recipe: AIRecipe) => void;
}

export default function RecipeCard({ recipe, onOpenRecipe }: RecipeCardProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    isRecipeFavorite(recipe.id).then(setFavorite);
  }, [recipe.id]);

  const toggleFavorite = async () => {
    if (favorite) {
      await removeRecipeFromFavorites(recipe.id);
      setFavorite(false);
    } else {
      await addRecipeToFavorites(recipe);
      setFavorite(true);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.shortDescription}</Text>

      {!!recipe.healthReason && (
        <Text style={styles.reason}>
          Pourquoi c’est santé : {recipe.healthReason}
        </Text>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => onOpenRecipe(recipe)}>
          <Text style={styles.buttonText}>Voir la recette</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteText}>
            {favorite ? "★ Favori" : "☆ Favori"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    color: "#555",
    marginBottom: 8,
  },
  reason: {
    color: "#2e7d32",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  favoriteButton: {
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  favoriteText: {
    fontWeight: "700",
  },
});