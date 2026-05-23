import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Rating } from '@kolking/react-native-rating';

export function DetailsPage({ route }) {
  const { restaurant } = route.params;

return (
    <ScrollView style={styles.container}>
 
      <View style={styles.header}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.category}>{restaurant.category}</Text>
      </View>
 
      <View style={styles.divider} />
 
      <View style={styles.section}>
 
        <View style={styles.row}>
          <Text style={styles.label}>Lokation</Text>
          <Text style={styles.value}>{restaurant.location}</Text>
        </View>
 
        <View style={styles.row}>
          <Text style={styles.label}>Rating</Text>
          <Rating size={30} rating={restaurant.rating} disabled />
        </View>
 
        <View style={styles.row}>
          <Text style={styles.label}>Noter</Text>
          <Text style={styles.value}>{restaurant.notes || "Ingen noter"}</Text>
        </View>
 
      </View>
 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    color: "#888",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd",
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#aaa",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
});