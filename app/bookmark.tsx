import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { Link, router, useFocusEffect } from "expo-router";
import BottomNav from "./components/bottomnav";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
};

export default function Bookmarks() {
  const [bookmarkedMeals, setBookmarkedMeals] = React.useState<Meal[]>([]);

  // Menggunakan useFocusEffect untuk memuat ulang bookmark setiap kali halaman difokus
  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarks");
      if (bookmarks) {
        setBookmarkedMeals(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  const removeBookmark = async (idMeal: string) => {
    try {
      const updatedBookmarks = bookmarkedMeals.filter(
        (meal) => meal.idMeal !== idMeal
      );
      await AsyncStorage.setItem(
        "bookmarks",
        JSON.stringify(updatedBookmarks)
      );
      setBookmarkedMeals(updatedBookmarks);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const navigateToDetail = (id: string) => {
    router.push({
      pathname: "/detail/[id]",
      params: { id },
    });
  };

  const renderItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <TouchableOpacity
        style={styles.mealContainer}
        onPress={() => navigateToDetail(item.idMeal)}
      >
        <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>{item.strMeal}</Text>
          {item.strCategory && (
            <Text style={styles.categoryText}>{item.strCategory}</Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigateToDetail(item.idMeal)}
            style={styles.detailButton}
          >
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeBookmark(item.idMeal)}
            style={styles.deleteButton}
          >
            <Icon name="trash-bin-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="bookmark" size={24} color="#FF6B6B" />
        <Text style={styles.header}>Saved Recipe</Text>
      </View>

      {bookmarkedMeals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            There's nothing to see here.{"\n"}Start saving your favorite recipes
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedMeals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  mealItem: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});