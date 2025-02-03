import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Text, IconButton, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import MenuCard from "./components/MenuCard";
import SearchBar from "./components/SearchBar";
import { Link } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [menu, setMenu] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRecipes = useCallback(async () => {
    try {
      // Check internet connection first
      const netInfoState = await NetInfo.fetch();
      if (!netInfoState.isConnected) {
        throw new Error("No internet connection");
      }

      setLoading(true);
      setError(null);

      // Use Promise.all for concurrent requests
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      const responses = await Promise.all(
        alphabet.map(async (letter) => {
          try {
            const response = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`
            );
            return response.data.meals || [];
          } catch (err) {
            console.warn(`Failed to fetch meals for letter ${letter}:`, err);
            return [];
          }
        })
      );

      // Flatten and deduplicate meals
      const allMeals = Array.from(
        new Map(
          responses.flat().map((meal) => [meal.idMeal, meal])
        ).values()
      );

      setMenu(allMeals);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch recipes";
      
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  const filteredMenu = useMemo(() => {
    if (searchText.trim().length === 0) return [];
    return menu.filter((item) =>
      item.strMeal.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, menu]);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.noResultsContainer}>
      <IconButton icon="magnify" size={64} iconColor="#ccc" />
      <Text style={styles.noResults}>
        {error ? "Error loading recipes" : "No available recipes"}
      </Text>
    </View>
  ), [error]);

  const renderItem = useCallback(({ item }: { item: Meal }) => (
    <Link href={`/detail/${item.idMeal}`} asChild>
      <MenuCard item={item} />
    </Link>
  ), []);

  const keyExtractor = useCallback((item: Meal) => item.idMeal, []);

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        onSearch={setSearchText}
        onClear={() => setSearchText("")}
        placeholder="Search recipes..."
      />
      {loading ? (
        <ActivityIndicator animating size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  listContainer: { 
    padding: 16 
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: { 
    fontSize: 16, 
    color: "#666", 
    marginTop: 16 
  },
});