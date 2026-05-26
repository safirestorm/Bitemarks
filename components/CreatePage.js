import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, database } from "../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Rating } from "@kolking/react-native-rating";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { Picker } from "@react-native-picker/picker";

const CATEGORIES = [
  "Restaurant",
  "Café",
  "Fastfood",
  "Bar",
  "Point of interest",
];

export function CreatePage({ navigation, route }) {
  const uid = auth.currentUser.uid; // Saves the users id in a variable
  const latitude = route.params?.latitude; // Checks if a param exists
  const longitude = route.params?.longitude;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Coverts a written adress into coordinates through google API
  async function fetchCoordinates() {
    try {
      const response = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          encodeURIComponent(location) +
          "&key=" +
          GOOGLE_MAPS_API_KEY,
      );
      const data = await response.json();
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      alert("reply from Google " + error);
    }
  }

  // Coverts coordinates into and address through google API
  async function fetchAddress() {
    try {
      const response = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          latitude +
          "," +
          longitude +
          "&key=" +
          GOOGLE_MAPS_API_KEY,
      );
      const data = await response.json();
      const address = data.results[0].formatted_address;
      return address;
    } catch (error) {
      alert("reply from Google " + error);
    }
  }

  // Checks if there's coordinates and adds address to location
  useEffect(() => {
    if (latitude && longitude) {
      fetchAddress().then((address) => setLocation(address));
    }
  }, []);

  async function addRestaurant() {
    if(!name.trim()) {
      Alert.alert('Manglende oplysninger', 'Du skal indtaste et navn.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Manglende oplysninger', 'Du skal indtaste en adresse.');
      return;
    }

    let lat, lng;

    if (latitude && longitude) {
      lat = latitude;
      lng = longitude;
    } else {
      const coordinates = await fetchCoordinates();
      lat = coordinates.lat;
      lng = coordinates.lng;
    }

    await addDoc(collection(database, "users", uid, "restaurants"), {
      name: name,
      category: category,
      cuisine: cuisine,
      location: location,
      lat: lat,
      lng: lng,
      rating: rating,
      notes: notes,
    });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tilføj spisested</Text>

      <Text style={styles.label}>Navn</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Navn"
      />

      <Text style={styles.label}>Kategori</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
      >
        <Text>{category || "Vælg kategori"}</Text>
      </TouchableOpacity>
      {showCategoryPicker && (
        <Picker
          selectedValue={category}
          onValueChange={(val) => {
            setCategory(val);
            setShowCategoryPicker(false);
          }}
        >
          {CATEGORIES.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Cuisine</Text>
      <TextInput
        style={styles.input}
        value={cuisine}
        onChangeText={setCuisine}
        placeholder="Cuisine"
      />

      <Text style={styles.label}>Adresse</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Adresse"
      />

      <Text style={styles.label}>Rating</Text>
      <Rating
        size={40}
        rating={rating}
        onChange={(value) => setRating(value)}
      />

      <Text style={styles.label}>Noter</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Kommentarer..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={addRestaurant}>
        <Text style={styles.buttonText}>Gem spisested</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
