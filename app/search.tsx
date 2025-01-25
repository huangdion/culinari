import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import MenuCard from "./components/MenuCard";
import SearchBar from "./components/SearchBar";
import SearchHistory from "./components/SearchHistory";
import { router } from "expo-router";

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Fetch menu data and search history on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      fetchRecipes();
      loadSearchHistory();
    };
    fetchInitialData();
  }, []);


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
  

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("searchHistory");
      if (history) setSearchHistory(JSON.parse(history));
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  };

  const saveToHistory = async (term) => {
    const newHistory = [
      term,
      ...searchHistory.filter((item) => item !== term),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredMenu([]);
    } else {
      const results = menu.filter((item) =>
        item.strMeal.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMenu(results);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) saveToHistory(searchText.trim());
  };

  const navigateToDetail = (id) => {
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  const renderRecipeItem = ({ item }) => (
    <MenuCard item={item} navigateToDetail={navigateToDetail} />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        onSearch={handleSearch}
        onClear={() => handleSearch("")}
        onSubmit={handleSearchSubmit}
      />
      <SearchHistory
        history={searchHistory}
        onSelect={handleSearch}
        onClear={async () => {
          await AsyncStorage.removeItem("searchHistory");
          setSearchHistory([]);
        }}
      />
      {searchText.length > 0 ? (
        filteredMenu.length > 0 ? (
          <FlatList
            data={filteredMenu}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderRecipeItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Icon name="search" size={64} color="#ccc" />
            <Text style={styles.noResults}>No available recipe</Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 16 },
  noResultsContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noResults: { fontSize: 16, color: "#666", marginTop: 16 },
});
