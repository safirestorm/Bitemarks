import {  View, 
          Text, 
          TouchableOpacity,
          StyleSheet,
          SectionList,
          ActivityIndicator, } from "react-native";
import MapView from "react-native-maps";
import { FAB } from 'react-native-elements';
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database, auth } from "../firebase";


export function HomePage({ navigation }) {
  const [view, setView] = useState('list'); // Sets litsview as default
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchRestaurants() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      setError(null);
      setSections([]);

      const snapshot = await getDocs(collection(database, "users", user.uid, "restaurants"));

      const restaurants = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((r) => r.name) 
        .sort((a, b) => a.name.localeCompare(b.name));

      const group = {};
      for (const r of restaurants) {
        const letter = r.name[0].toUpperCase();
        if (!group[letter]) group[letter] = [];
        group[letter].push(r);
      }

      setSections(
        Object.keys(group)
          .sort()
          .map((letter) => ({ title: letter, data: group[letter] }))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  fetchRestaurants();
}, [auth.currentUser?.uid]);


return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, view === "list" && styles.activeButton]}
          onPress={() => setView("list")}
        >
          <Text style={[styles.toggleText, view === "list" && styles.activeText]}>
            Liste
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, view === "map" && styles.activeButton]}
          onPress={() => setView("map")}
          
        >
          <Text style={[styles.toggleText, view === "map" && styles.activeText]}>
            Kort
          </Text>
        </TouchableOpacity>
      </View>
 
      {view === "map" ? (
        <View style={styles.content}>
          <Text>Kort placeholder</Text>
        </View>
      ) : loading ? (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      ) : error ? (
        <View style={styles.content}>
          <Text style={styles.errorText}>Kunne ikke hente restauranter.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} activeOpacity={0.7}
              onPress={() => navigation.navigate("Detail", { restaurant: item })}

            >
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.cuisine && (
                  <Text style={styles.itemCuisine}>{item.cuisine}</Text>
                )}
              </View>
              {item.address && (
                <Text style={styles.itemAddress} numberOfLines={1}>
                  {item.address}
                </Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.content}>
              <Text style={styles.emptyText}>Ingen restauranter fundet.</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}
 
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  toggleContainer: {
      flexDirection: "row",
      margin: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ccc",
      overflow: "hidden",
  },
  toggleButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: "#fff",
  },
  activeButton: {
      backgroundColor: "#333",
  },
  toggleText: {
      fontWeight: "600",
      color: "#333",
  },
  activeText: {
      color: "#fff",
  },
  content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
    sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "rgba(247,247,247,1.0)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  itemCuisine: {
    fontSize: 13,
    color: "#888",
  },
  itemAddress: {
    marginTop: 3,
    fontSize: 13,
    color: "#aaa",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginLeft: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  errorText: {
    color: "#c0392b",
    fontSize: 16,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
  },
  fabText: {
      color: '#fff',
      fontSize: 28,
      lineHeight: 30,
  },
});