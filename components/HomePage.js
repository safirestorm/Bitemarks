import {  View, 
          Text, 
          TouchableOpacity, 
          StyleSheet,
          SectionList,
          ActivityIndicator, } from "react-native";
import MapView from "react-native-maps";
import { useState } from "react";
import { FAB } from 'react-native-elements';
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";


export function HomePage({ navigation }) {

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

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Create')}>
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