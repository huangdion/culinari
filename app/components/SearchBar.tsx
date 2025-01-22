import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function SearchBar({ searchText, onSearch, onClear, onSubmit }) {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        placeholder="Cari Resep"
        style={styles.searchBar}
        value={searchText}
        onChangeText={onSearch}
        onSubmitEditing={onSubmit}
        placeholderTextColor="#888"
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 8,
  },
});
