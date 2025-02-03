import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
};

type Category = {
  strCategory: string;
  strCategoryThumb: string;
};

export default function App() {
  const [menu, setMenu] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchAndCacheRecipes = async () => {
    try {
      // Check if cached data exists and is recent
      const cachedMeals = await AsyncStorage.getItem('cached_meals');
      const cachedCategories = await AsyncStorage.getItem('cached_categories');
      const lastFetchTime = await AsyncStorage.getItem('last_fetch_time');

      // Check if cache is less than 24 hours old
      const isCacheValid = lastFetchTime && 
        (Date.now() - parseInt(lastFetchTime, 10) < 24 * 60 * 60 * 1000);

      if (cachedMeals && cachedCategories && isCacheValid) {
        setMenu(JSON.parse(cachedMeals));
        setCategories(JSON.parse(cachedCategories));
        return;
      }

      // Fetch from API if no cached data or cache is old
      const [recipesResponse, categoriesResponse] = await Promise.all([
        axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s="),
        axios.get("https://www.themealdb.com/api/json/v1/1/categories.php")
      ]);

      if (recipesResponse.data.meals) {
        await AsyncStorage.setItem('cached_meals', JSON.stringify(recipesResponse.data.meals));
        setMenu(recipesResponse.data.meals);
      }

      if (categoriesResponse.data.categories) {
        await AsyncStorage.setItem('cached_categories', JSON.stringify(categoriesResponse.data.categories));
        setCategories(categoriesResponse.data.categories);
      }

      // Update last fetch time
      await AsyncStorage.setItem('last_fetch_time', Date.now().toString());
    } catch (error) {
      console.error("Failed to fetch or cache recipes:", error);
    }
  };

  useEffect(() => {
    fetchAndCacheRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Culinari</Text>
          <Text style={styles.headerSubtitle}>Discover Delicious Recipes</Text>
        </View>

        {/* Popular Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Recipes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menu.slice(0, 10).map((item) => (
              <Link 
                key={item.idMeal} 
                href={`/detail/${item.idMeal}`} 
                style={styles.recipeCard}
              >
                <Image 
                  source={{ uri: item.strMealThumb }} 
                  style={styles.recipeImage} 
                />
                <View style={styles.recipeOverlay}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {item.strMeal}
                  </Text>
                </View>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Recipe Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <Link
                key={category.strCategory}
                href={`/menu/${category.strCategory}`}
                style={styles.categoryItem}
              >
                <Image 
                  source={{ uri: category.strCategoryThumb }} 
                  style={styles.categoryImage} 
                />
                <Text style={styles.categoryLabel}>{category.strCategory}</Text>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#F6E6C2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#7F8C8D',
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  recipeCard: {
    width: 200,
    height: 250,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  recipeTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '32%',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  categoryLabel: {
    textAlign: 'center',
    padding: 10,
    fontWeight: '600',
    color: '#2C3E50',
  }
});