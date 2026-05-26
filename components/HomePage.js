import {  View, 
          Text, 
          TouchableOpacity, 
          StyleSheet,
          SectionList,
          ActivityIndicator,
          Platform, } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FAB, SearchBar } from 'react-native-elements';
import { useState, useEffect } from "react";
import { collection } from "firebase/firestore";
import { database, auth } from "../firebase";
import { useCollection } from 'react-firebase-hooks/firestore'
import { Ionicons } from '@expo/vector-icons';


export function HomePage({ navigation }) {
  const [view, setView] = useState('list'); // Sets litsview as default
  const uid = auth.currentUser.uid; // Saves the users id in a variable
  const [values, loading, error] = useCollection(collection(database, "users", uid, "restaurants"))
  const data = values?.docs.map((doc)=>({...doc.data(), id:doc.id})) ?? []
  const [search, setSearch] = useState('')

  // Bestemmer hvilken andel af verdenen kortet viser
  const [region, setRegion] = useState({
    latitude:55.5,
    longitude:10.5,
    latitudeDelta:6,  // Delta = Hvor mange grader vi skal vise/Hvor meget Zoom
    longitudeDelta:6 
  })

  const sections = Object.entries(
    data
      .filter(r => r.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((group, r) => {
        const letter = r.name[0].toUpperCase();
        if (!group[letter]) group[letter] = [];
        group[letter].push(r);
        return group;
      }, {})
  ).map(([letter, items]) => ({ title: letter, data: items }));

  const filteredSections = sections
    .map(section => ({
      ...section,
      data: section.data.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
  .filter(section => section.data.length > 0);


return (
  <View style={styles.container}>
    <SearchBar
      placeholder="Søg efter sted"
      onChangeText={setSearch}
      value={search}
      platform={Platform.OS}
      searchIcon={<Ionicons name="search-outline" size={20} color="#888" />}
      clearIcon={false}
      /> 
    <View style={styles.card}>
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
        <MapView
          style={styles.map}
          region={region}
        >
          {data.filter(r => r.lat && r.lng && r.name?.toLowerCase().includes(search.toLowerCase())).map(restaurant => (
            <Marker
              key={restaurant.id}
              coordinate={{ latitude: restaurant.lat, longitude: restaurant.lng }}
              title={restaurant.name}
              onPress={() => navigation.navigate('Detail', { restaurant })}
            />
          ))}   
        </MapView>
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
        sections={filteredSections}
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
      </View>

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
  card: {
    flex: 1,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  toggleContainer: {
      flexDirection: "row",
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
  map: {
    width:'100%',
    height:'100%'
  }
});