import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { NutriScoreLetter } from "../services/productQuality";

function label(score: NutriScoreLetter) {
  if (score === "unknown") return "?";
  return score.toUpperCase();
}

function bg(score: NutriScoreLetter) {
  switch (score) {
    case "a": return "#1b9e77";
    case "b": return "#66a61e";
    case "c": return "#e6ab02";
    case "d": return "#d95f02";
    case "e": return "#e7298a";
    default: return "#666";
  }
}

export default function NutriScoreBadge({ score }: { score: NutriScoreLetter }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg(score) }]}>
      <Text style={styles.text}>Nutri-Score {label(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, alignSelf: "flex-start" },
  text: { color: "white", fontWeight: "700" },
});
