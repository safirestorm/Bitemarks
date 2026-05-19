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
import { db } from "../firebase";


export function HomePage({ navigation }) {

  const [view, setView] = useState('list'); // Sets litsview as default
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResturants() {
      try {
        const snapshot = await getDocs(collection(db, 'resturants'))

        const resturants = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));

        const group = {};
        for (const r of resturants) {
          const letter = r.name[0].toUpperCase();
          if (!group[letter]) group[letter] = [];
          group[letter].push(r);
        }

        setSection(
          Object.keys(group)
          .sort()
          .map((letter) => ({ title: length, data: group[letter] }))
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchResturants();
  }, []);



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
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
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