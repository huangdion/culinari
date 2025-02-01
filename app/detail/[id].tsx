import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function MealDetail() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const mealData = response.data.meals[0];
        setMeal(mealData);

        const ingredientList = [];
        for (let i = 1; i <= 35; i++) {
          const ingredient = mealData[`strIngredient${i}`];
          const measure = mealData[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== "") {
            ingredientList.push({ ingredient, measure });
          }
        }
        setIngredients(ingredientList);
      } catch (error) {
        console.error("Error fetching meal details:", error);
        Alert.alert("Error", "Failed to load recipe details");
      }
    };

    const checkBookmark = async () => {
      try {
        const bookmarks = await AsyncStorage.getItem("bookmarks");
        if (bookmarks) {
          const bookmarkedMeals = JSON.parse(bookmarks);
          setIsBookmarked(bookmarkedMeals.some((meal) => meal.idMeal === id));
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };

    fetchMeal();
    checkBookmark();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarks");
      let bookmarkedMeals = bookmarks ? JSON.parse(bookmarks) : [];

      if (isBookmarked) {
        bookmarkedMeals = bookmarkedMeals.filter((meal) => meal.idMeal !== id);
        Alert.alert("Bookmark Removed", "Recipe has been removed from bookmarks");
      } else {
        bookmarkedMeals.push(meal);
        Alert.alert("Bookmark Added", "Recipe has been added to bookmarks");
      }

      await AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarkedMeals));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{meal.strMeal}</Text>
            <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
              <Icon
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#FF6B6B"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="restaurant-outline" size={20} color="#666" />
              <Text style={styles.category}>{meal.strCategory}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-outline" size={20} color="#666" />
              <Text style={styles.area}>{meal.strArea}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsContainer}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Icon name="checkmark-circle-outline" size={20} color="#4CAF50" />
                  <Text style={styles.ingredientText}>
                    {item.measure} {item.ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>{meal.strInstructions}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  bookmarkButton: {
    padding: 8,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginLeft: 6,
  },
  area: {
    fontSize: 16,
    color: "#666",
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  ingredientsContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: "#444",
    marginLeft: 8,
  },
  instructions: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
});
