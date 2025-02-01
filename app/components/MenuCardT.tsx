import React from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import styles from "./styles";
export default function MenuCard({ item }: { item: { idMeal: string; strMealThumb: string; strMeal: string } }) {
  return (
    <Link href={`/detail/${item.idMeal}`} asChild>
      <View style={styles.card}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.strMeal}</Text>
        </View>
      </View>
    </Link>
  );
}

