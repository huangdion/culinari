import React, { useCallback } from "react";
import { View, FlatList, StyleSheet, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import { Card, Text, IconButton, List } from "react-native-paper";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
};

const BookmarkItem = ({ item, onRemove }: { item: Meal; onRemove: (id: string) => void }) => (
  <Card style={styles.mealItem}>
    <Card.Content style={styles.mealContainer}>
      <Link href={`/detail/${item.idMeal}`} asChild>
        <Pressable style={styles.mealInfoContainer}>
          <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text variant="titleMedium">{item.strMeal}</Text>
            {item.strCategory && (
              <Text variant="bodySmall" style={styles.categoryText}>
                {item.strCategory}
              </Text>
            )}
          </View>
        </Pressable>
      </Link>
      <IconButton
        icon="trash-can-outline"
        iconColor="#FF6B6B"
        size={20}
        onPress={() => onRemove(item.idMeal)}
        style={styles.deleteButton}
      />
    </Card.Content>
  </Card>
);

export default function Bookmarks() {
  const [bookmarkedMeals, setBookmarkedMeals] = React.useState<Meal[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarks");
      setBookmarkedMeals(bookmarks ? JSON.parse(bookmarks) : []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  const handleRemove = useCallback(async (idMeal: string) => {
    try {
      const updated = bookmarkedMeals.filter(meal => meal.idMeal !== idMeal);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
      setBookmarkedMeals(updated);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  }, [bookmarkedMeals]);

  return (
    <View style={styles.container}>
      <List.Subheader>Saved Recipes</List.Subheader>
      <FlatList
        data={bookmarkedMeals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <BookmarkItem item={item} onRemove={handleRemove} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconButton icon="book-outline" size={64} iconColor="#e0e0e0" />
            <Text variant="bodyMedium" style={styles.emptyText}>
              There's nothing to see here. Start saving your favorite recipes.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  mealItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  mealContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mealInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12, // Tambahkan margin kanan
  },
  mealImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  mealInfo: {
    flex: 1,
    marginRight: 8, // Tambahkan margin kanan
  },
  categoryText: {
    color: "#666666",
  },
  deleteButton: {
    marginLeft: 'auto', // Dorong tombol ke kanan
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
  },
});