import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";

export default function MenuCard({ item, navigateToDetail }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToDetail(item.idMeal)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.strMeal}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f6e6c2",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
