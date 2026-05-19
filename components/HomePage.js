import {  View, 
          Text, 
          TouchableOpacity, 
          StyleSheet,
          SectionList,
          ActivityIndicator, } from "react-native";
import MapView from "react-native-maps";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";


export function HomePage() {

  const [view, setView] = useState('list'); // Sets litsview as default

  return(
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, view === 'list' && styles.activeButton]}
            onPress={() => setView('list')}
          >
            <Text style={[styles.toggleText, view === 'list' && styles.activeText]}>Liste</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, view === 'map' && styles.activeButton]}
            onPress={() => setView('map')}
          >
            <Text style={[styles.toggleText, view === 'map' && styles.activeText]}>Kort</Text>
        </TouchableOpacity>
      </View>
      
      {view === 'map' ? (
        <View style={styles.content}>
          <Text>Kort placeholder</Text>
        </View>
        ) : (
        <View style={styles.content}>
          <Text>Liste placeholder</Text>
        </View>
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
});