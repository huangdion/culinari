import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function SearchHistory({ history, onSelect, onClear }) {
  if (history.length === 0) return null;

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Search History</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearHistoryText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {history.map((term, index) => (
        <TouchableOpacity key={index} style={styles.historyItem} onPress={() => onSelect(term)}>
          <Icon name="time-outline" size={20} color="#666" />
          <Text style={styles.historyText}>{term}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearHistoryText: {
    color: "#FF6B6B",
    fontSize: 14,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  historyText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
  },
});
