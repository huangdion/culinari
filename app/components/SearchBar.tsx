import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

export default function SearchBar({ searchText, onSearch, onClear, onSubmit }) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Find some recipe.."
        value={searchText}
        onChangeText={onSearch}
        onIconPress={onClear}
        onSubmitEditing={onSubmit}
        style={styles.searchBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  searchBar: {
    borderRadius: 12,
  },
});
