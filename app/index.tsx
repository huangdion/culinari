import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import BottomNav from './components/bottomnav'; // Import BottomNav component

export default function App() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch popular recipes from API
  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
      const data = await response.json();
      if (data.meals) {
        setMenu(data.meals);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
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
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headbox}>
          <Text style={styles.head}>What Recipe Are You Looking for Today?</Text>
        </View>

        {/* Popular Recipes Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Popular Recipes</Text>
          <ScrollView horizontal style={styles.menuScroll}>
            {menu.slice(0, 5).map((item, index) => (
              <Link key={index} href={{ pathname: '/detail/[id]', params: { id: item.idMeal } }}>
                <View style={styles.menuCard}>
                  <Image source={{ uri: item.strMealThumb }} style={styles.menuImage} />
                  <Text style={styles.menuText}>{item.strMeal}</Text>
                </View>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={styles.kategoriContainer}>
          <Text style={styles.kategoriTitle}>Categories</Text>
          <View style={styles.kategoriGrid}>
            {categories.map((category, index) => (
              <Link
                key={index}
                href={{ pathname: '/menu/[category]', params: { category: category.strCategory } }}
                asChild
              >
                <TouchableOpacity style={styles.kategoriItem}>
                  <Image 
                    source={{ uri: category.strCategoryThumb || 'https://via.placeholder.com/100' }} 
                    style={styles.kategoriImage} 
                  />
                  <Text style={styles.kategoriLabel}>{category.strCategory}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  scrollContainer: {
    paddingBottom: 60,  // Adding padding to make room for BottomNav
  },
  headbox: {
    flexDirection: "row",
    backgroundColor: "#F6E6C2",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: "#ddd",
  },
  head: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  menuContainer: {
    padding: 20,
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  menuScroll: {
    flexDirection: 'row',
  },
  menuCard: {
    width: 200,
    height: 250,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  menuImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  menuText: {
    fontSize: 16,
    padding: 10,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  kategoriContainer: {
    padding: 20,
    marginBottom: 20,
  },
  kategoriTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  kategoriGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  kategoriItem: {
    alignItems: "center",
    width: "30%",
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  kategoriImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  kategoriLabel: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 10,
    color: "#333",
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
