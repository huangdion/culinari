import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: "#f6e6c2",
      borderRadius: 12,
      marginBottom: 16,
      padding: 12,
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 4,
    },
    infoContainer: {
      flexDirection: "column",
      gap: 4,
    },
    categoryContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    areaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    kategori: {
      fontSize: 14,
      color: "#666",
      marginLeft: 4,
    },
    deskripsi: {
      fontSize: 14,
      color: "#666",
      marginLeft: 4,
    },
  });
  

export default styles;