import React from "react";
import { View, Text, StyleSheet } from "react-native";

type NutriScoreLetter = "a" | "b" | "c" | "d" | "e" | "unknown";

export default function HealthWarning({ score }: { score: NutriScoreLetter }) {
  if (score !== "d" && score !== "e") return null;

  return (
    <View style={styles.box}>
      <Text style={styles.title}>⚠️ Produit moins sain</Text>
      <Text style={styles.text}>
        Nutri-Score {score.toUpperCase()} → on te propose des alternatives plus saines.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffeeba",
    marginTop: 10,
  },
  title: { fontWeight: "800", marginBottom: 4 },
  text: { color: "#333" },
});
