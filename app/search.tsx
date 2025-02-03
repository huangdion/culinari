import React, { useState, useEffect, useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, IconButton, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import MenuCard from "./components/MenuCard";
import SearchBar from "./components/SearchBar";
import { Link } from "expo-router";

export default function Index() {
  // State buat nyimpen teks pencarian
  const [searchText, setSearchText] = useState("");
  // State buat nyimpen semua menu yang didapat dari API
  const [menu, setMenu] = useState([]);
  // State buat ngecek apakah data masih loading atau udah siap ditampilkan
  const [loading, setLoading] = useState(true);

  // Ambil data saat komponen pertama kali muncul
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fungsi buat ambil data resep dari API
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

  // Optimalkan filter menu pakai useMemo biar gak nge-render ulang terus
  const filteredMenu = useMemo(() => {
    if (!searchText.trim()) return menu;
    return menu.filter((item) =>
      item.strMeal.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, menu]);

  return (
    <View style={styles.container}>
      {/* Komponen SearchBar buat input pencarian */}
      <SearchBar
        searchText={searchText}
        onSearch={setSearchText}
        onClear={() => setSearchText("")}
      />

      {/* Kalau masih loading, tampilin spinner */}
      {loading ? (
        <ActivityIndicator animating size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <Link href={`/detail/${item.idMeal}`} asChild>
              <MenuCard item={item} />
            </Link>
          )}
          ListEmptyComponent={() => (
            <View style={styles.noResultsContainer}>
              <IconButton icon="magnify" size={64} iconColor="#ccc" />
              <Text style={styles.noResults}>No available recipe</Text>
            </View>
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

