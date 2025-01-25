import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import MenuCard from '../components/MenuCardT'; // Import MenuCard component
import axios from 'axios';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
};

export default function KategoriPage() {
  const { category } = useLocalSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, [category]);


const fetchMeals = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    if (response.data.meals) {
      setMeals(response.data.meals);
    }
  } catch (error) {
    console.error(`Failed to fetch meals for category ${category}:`, error);
    setError("Failed to load recipes. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  const navigateToDetail = (id: string) => {
    router.push({
      pathname: '/detail/[id]',
      params: { id }
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Meal }) => (
    <MenuCard
      item={item}
      navigateToDetail={navigateToDetail}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{category} Recipes</Text>
        <Text style={styles.subtitle}>{meals.length} Recipes found</Text>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
});
