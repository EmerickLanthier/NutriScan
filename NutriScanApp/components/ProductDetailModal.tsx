import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import NutriScoreBadge from "@/components/NutriScoreBadge";
import HealthWarning from "@/components/HealthWarning";

import { fetchProduct, ProductData } from "@/services/openFoodFacts";
import { fetchHealthyAlternatives, AlternativeProduct } from "@/services/healthyAlternatives";
import type { NutriScoreLetter } from "@/services/productQuality";

import { generateRecipesFromGemini, AIRecipe } from "@/services/geminiRecipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeStepModal from "@/components/RecipeStepModal";

interface ProductDetailModalProps {
  visible: boolean;
  product: ProductData | null;
  onClose: () => void;
  level?: "low" | "moderate" | "high" | null;
}

export default function ProductDetailModal({
  visible,
  product,
  onClose,
}: ProductDetailModalProps) {
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);
  const [loadingAlt, setLoadingAlt] = useState(false);

  const [displayProduct, setDisplayProduct] = useState<ProductData | null>(product);
  const [history, setHistory] = useState<ProductData[]>([]);
  const [loadingDisplayProduct, setLoadingDisplayProduct] = useState(false);

  const [recipes, setRecipes] = useState<AIRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<AIRecipe | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  // reset quand on ouvre/ferme ou quand le product parent change
  useEffect(() => {
    if (!visible) {
      setDisplayProduct(product);
      setHistory([]);
      setAlternatives([]);
      setLoadingAlt(false);
      setLoadingDisplayProduct(false);
      return;
    }
    setDisplayProduct(product);
    setHistory([]);
  }, [visible, product]);

  const score: NutriScoreLetter = useMemo(() => {
    const raw = String(displayProduct?.nutriscore ?? "").toLowerCase();
    return raw === "a" || raw === "b" || raw === "c" || raw === "d" || raw === "e"
      ? (raw as NutriScoreLetter)
      : "unknown";
  }, [displayProduct?.nutriscore]);

  // load alternatives (uniquement si D/E)
  useEffect(() => {
    if (!displayProduct) {
      setAlternatives([]);
      setLoadingAlt(false);
      return;
    }

    if (score !== "d" && score !== "e") {
      setAlternatives([]);
      return;
    }

    const load = async () => {
      try {
        setLoadingAlt(true);

        const result = await fetchHealthyAlternatives({
          categoryTag: displayProduct.categoryTag,
          queryTextFallback: displayProduct.name ?? "produit",
        });

        setAlternatives(result);
      } catch (e) {
        console.log("Erreur alternatives:", e);
        setAlternatives([]);
      } finally {
        setLoadingAlt(false);
      }
    };

    load();
  }, [displayProduct?.barcode, displayProduct?.name, displayProduct?.categoryTag, score]);

  // ✅ loadRecipes avec useCallback — se met à jour quand displayProduct.name change
  const loadRecipes = useCallback(async () => {
    if (!displayProduct?.name) return;

    try {
      setLoadingRecipes(true);
      const generated = await generateRecipesFromGemini(displayProduct.name);
      setRecipes(generated);
    } catch (e) {
      console.log("Erreur recettes Gemini:", e);
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  }, [displayProduct?.name]);

  // ✅ useEffect déclenché à chaque fois que loadRecipes change (= nouveau produit)
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleClose = () => {
    setDisplayProduct(product);
    setHistory([]);
    setAlternatives([]);
    setLoadingAlt(false);
    setLoadingDisplayProduct(false);
    onClose();
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      const last = copy.pop()!;
      setDisplayProduct(last);
      return copy;
    });
  };

  const openAlternative = async (barcode: string) => {
    if (!displayProduct) return;

    const clean = String(barcode).trim().replace(/[^\d]/g, "");
    if (!clean) return;

    setLoadingDisplayProduct(true);

    try {
      const p = await fetchProduct(clean);

      if (!p) {
        setLoadingDisplayProduct(false);
        return;
      }

      setHistory((prev) => [...prev, displayProduct]);
      setDisplayProduct(p);
    } catch (e) {
      console.log("Erreur chargement alternative:", e);
    } finally {
      setLoadingDisplayProduct(false);
    }
  };

  const openRecipe = (recipe: AIRecipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const closeRecipeModal = () => {
    setRecipeModalVisible(false);
    setSelectedRecipe(null);
  };

  if (!displayProduct) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Top bar: back (si historique) + close */}
          <View style={styles.topBar}>
            {history.length > 0 ? (
              <TouchableOpacity style={styles.backButton} onPress={goBack} activeOpacity={0.8}>
                <IconSymbol name="chevron.left" size={22} color="#333" />
                <Text style={styles.backText}>Retour</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.8}>
              <IconSymbol name="xmark.circle.fill" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {loadingDisplayProduct && (
              <Text style={styles.smallText}>Chargement du produit…</Text>
            )}

            <View style={styles.headerSection}>
              {displayProduct.image ? (
                <Image source={{ uri: displayProduct.image }} style={styles.productImage} />
              ) : (
                <View style={[styles.productImage, styles.placeholderImage]}>
                  <Text style={{ color: "#888" }}>No Image</Text>
                </View>
              )}

              <View style={styles.headerTexts}>
                <Text style={styles.productName}>{displayProduct.name}</Text>
                <Text style={styles.brandName}>{displayProduct.brands}</Text>

                {displayProduct.quantity ? (
                  <Text style={styles.quantityText}>Quantité : {displayProduct.quantity}</Text>
                ) : null}

                <View style={{ marginTop: 8 }}>
                  <NutriScoreBadge score={score} />
                  <HealthWarning score={score} />
                </View>
              </View>
            </View>

            {displayProduct.labels && displayProduct.labels.length > 0 && (
              <View style={styles.labelsContainer}>
                {displayProduct.labels.map((label, index) => (
                  <View key={index} style={styles.labelBadge}>
                    <Text style={styles.labelText}>
                      {label.replace("en:", "").replace(/-/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.nutritionSection}>
              <Text style={styles.sectionTitle}>Valeurs Nutritionnelles (pour 100g)</Text>

              <View style={styles.nutritionTable}>
                {displayProduct.nutritionRows.map((row, index) => (
                  <NutritionRow
                    key={index}
                    label={row.label}
                    value={row.value}
                    unit={row.unit}
                    bold={row.bold}
                    subItem={row.subItem}
                    level={row.level}
                    last={index === displayProduct.nutritionRows.length - 1}
                  />
                ))}
              </View>

              {displayProduct.nutritionRows.length === 0 && (
                <Text style={styles.emptyText}>Aucune donnée nutritionnelle disponible.</Text>
              )}
            </View>

            {(score === "d" || score === "e") && (
              <View style={styles.altSection}>
                <Text style={styles.sectionTitle}>Alternatives plus saines</Text>

                {loadingAlt && (
                  <Text style={styles.smallText}>Recherche d'alternatives…</Text>
                )}

                {!loadingAlt && alternatives.length === 0 && (
                  <Text style={styles.smallText}>Aucune alternative trouvée.</Text>
                )}

                {alternatives.map((alt) => (
                  <TouchableOpacity
                    key={alt.code}
                    style={styles.altCard}
                    activeOpacity={0.85}
                    onPress={() => openAlternative(alt.code)}
                  >
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      {alt.imageUrl ? (
                        <Image source={{ uri: alt.imageUrl }} style={styles.altImage} />
                      ) : (
                        <View style={[styles.altImage, styles.placeholderImage]}>
                          <Text style={{ color: "#888", fontSize: 12 }}>No Img</Text>
                        </View>
                      )}

                      <View style={{ flex: 1 }}>
                        <Text style={styles.altTitle}>{alt.name}</Text>
                        {!!alt.brand && <Text style={styles.smallText}>{alt.brand}</Text>}
                        <Text style={styles.smallText}>
                          NutriScore: {alt.nutriScore.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Recettes santé proposées</Text>

              {loadingRecipes && (
                <Text style={styles.smallText}>Génération des recettes...</Text>
              )}

              {!loadingRecipes && recipes.length === 0 && (
                <Text style={styles.smallText}>Aucune recette disponible.</Text>
              )}

              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpenRecipe={openRecipe}
                />
              ))}
            </View>

            <RecipeStepModal
              visible={recipeModalVisible}
              recipe={selectedRecipe}
              onClose={closeRecipeModal}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface NutritionRowProps {
  label: string;
  value: string;
  unit: string;
  bold?: boolean;
  subItem?: boolean;
  last?: boolean;
  level?: "low" | "moderate" | "high" | null;
}

const NutritionRow = ({ label, value, unit, bold, subItem, last, level }: NutritionRowProps) => (
  <View
    style={[
      styles.nutriRow,
      level === "high" && styles.levelHigh,
      level === "moderate" && styles.levelModerate,
      level === "low" && styles.levelLow,
      last && styles.nutriRowLast,
      subItem && styles.nutriRowSub,
    ]}
  >
    <Text style={[styles.nutriLabel, bold && styles.boldText, subItem && styles.subItemText]}>
      {label}
    </Text>
    <Text style={[styles.nutriValue, bold && styles.boldText]}>
      {value} {unit}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "85%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  backText: {
    fontSize: 14,
    color: "#333",
  },

  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },

  headerSection: {
    flexDirection: "row",
    gap: 15,
    marginTop: 6,
    marginBottom: 12,
  },
  headerTexts: {
    flex: 1,
    justifyContent: "center",
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  brandName: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  quantityText: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },

  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  labelBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
  },
  labelText: {
    fontSize: 12,
    color: "#444",
    textTransform: "capitalize",
  },

  nutritionSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  nutritionTable: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    overflow: "hidden",
  },
  nutriRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nutriRowLast: {
    borderBottomWidth: 0,
  },
  nutriRowSub: {
    paddingLeft: 22,
  },
  nutriLabel: {
    fontSize: 13,
    color: "#333",
  },
  nutriValue: {
    fontSize: 13,
    color: "#333",
  },
  boldText: {
    fontWeight: "700",
  },
  subItemText: {
    color: "#666",
  },
  emptyText: {
    marginTop: 10,
    color: "#666",
    fontSize: 13,
  },

  // levels (optionnel)
  levelHigh: { backgroundColor: "rgba(255,0,0,0.06)" },
  levelModerate: { backgroundColor: "rgba(255,165,0,0.06)" },
  levelLow: { backgroundColor: "rgba(0,128,0,0.06)" },

  // alternatives
  altSection: { marginTop: 18 },
  altCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  altImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
  },
  altTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  smallText: {
    fontSize: 13,
    color: "#666",
  },
});
