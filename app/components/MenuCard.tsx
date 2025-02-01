import React from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Link } from "expo-router";

export default function MenuCard({
  item,
}: {
  item: {
    idMeal: string;
    strMealThumb: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
  };
}) {
  return (
    <Link href={`/detail/${item.idMeal}`} asChild>
      <View style={styles.card}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.strMeal}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.categoryContainer}>
              <Icon name="restaurant-outline" size={16} color="#666" />
              <Text style={styles.kategori}>{item.strCategory}</Text>
            </View>
            <View style={styles.areaContainer}>
              <Icon name="location-outline" size={16} color="#666" />
              <Text style={styles.deskripsi}>{item.strArea}</Text>
            </View>
          </View>
        </View>
        <Icon name="chevron-forward" size={24} color="#666" />
      </View>
    </Link>
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
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  areaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  kategori: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  deskripsi: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});
