import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      if (response.data.meals) {
        setMenu(response.data.meals);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Culinari</Text>
          <Text style={styles.headerSubtitle}>Discover Delicious Recipes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Recipes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menu.slice(0, 10).map((item, index) => (
              <Link 
                key={index} 
                href={{ pathname: '/detail/[id]', params: { id: item.idMeal } }}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Link
                key={index}
                href={{ pathname: '/menu/[category]', params: { category: category.strCategory } }}
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
    width: '30%',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: 'white',
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