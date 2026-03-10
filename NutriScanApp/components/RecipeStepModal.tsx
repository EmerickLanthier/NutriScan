import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { AIRecipe } from "@/services/geminiRecipes";

interface RecipeStepModalProps {
  visible: boolean;
  recipe: AIRecipe | null;
  onClose: () => void;
}

export default function RecipeStepModal({
  visible,
  recipe,
  onClose,
}: RecipeStepModalProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [recipe?.id, visible]);

  if (!recipe) return null;

  const steps = recipe.steps ?? [];
  const currentStep = steps[stepIndex] ?? "";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{recipe.title}</Text>

          <Text style={styles.counter}>
            Étape {stepIndex + 1} / {steps.length}
          </Text>

          <View style={styles.stepBox}>
            <Text style={styles.stepText}>{currentStep}</Text>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.navButton, stepIndex === 0 && styles.disabled]}
              disabled={stepIndex === 0}
              onPress={() => setStepIndex((prev) => prev - 1)}
            >
              <Text style={styles.navText}>Précédent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                stepIndex === steps.length - 1 && styles.disabled,
              ]}
              disabled={stepIndex === steps.length - 1}
              onPress={() => setStepIndex((prev) => prev + 1)}
            >
              <Text style={styles.navText}>Suivant</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  counter: {
    color: "#666",
    marginBottom: 12,
  },
  stepBox: {
    minHeight: 140,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    padding: 14,
    justifyContent: "center",
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 14,
  },
  navButton: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 12,
  },
  navText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.4,
  },
  closeButton: {
    marginTop: 14,
    backgroundColor: "#ececec",
    borderRadius: 10,
    paddingVertical: 12,
  },
  closeText: {
    textAlign: "center",
    fontWeight: "700",
  },
});