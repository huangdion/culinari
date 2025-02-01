import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, IconButton, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import MenuCard from "./components/MenuCard";
import SearchBar from "./components/SearchBar";
import { router } from "expo-router";

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      if (response.data.meals) setMenu(response.data.meals);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredMenu(
      text.trim()
        ? menu.filter((item) =>
            item.strMeal.toLowerCase().includes(text.toLowerCase())
          )
        : []
    );
  };

  const navigateToDetail = (id) => {
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        onSearch={handleSearch}
        onClear={() => handleSearch("")}
      />
      {loading ? (
        <ActivityIndicator animating size="large" style={styles.loader} />
      ) : searchText.length > 0 && filteredMenu.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <IconButton icon="magnify" size={64} iconColor="#ccc" />
          <Text style={styles.noResults}>No available recipe</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMenu.length > 0 ? filteredMenu : menu}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <MenuCard item={item} navigateToDetail={navigateToDetail} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: { fontSize: 16, color: "#666", marginTop: 16 },
});
