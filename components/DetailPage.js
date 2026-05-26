import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { Rating } from "@kolking/react-native-rating";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, database } from "../firebase";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

const CATEGORIES = [
  "Restaurant",
  "Café",
  "Fastfood",
  "Bar",
  "Point of interest",
];

export function DetailsPage({ route, navigation }) {
  const { restaurant } = route.params;
  const uid = auth.currentUser.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(restaurant.name);
  const [category, setCategory] = useState(restaurant.category);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [location, setLocation] = useState(restaurant.location);
  const [rating, setRating] = useState(restaurant.rating);
  const [notes, setNotes] = useState(restaurant.notes);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  async function fetchCoordinates(address) {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        encodeURIComponent(address) +
        "&key=" +
        GOOGLE_MAPS_API_KEY,
    );
    const data = await response.json();
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }

  async function deleteHandle() {
    Alert.alert(
      "Slet restaurant",
      `Er du sikker du vil slette ${restaurant.name}?`,
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Slet",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(
              doc(database, "users", uid, "restaurants", restaurant.id),
            );
            navigation.goBack();
          },
        },
      ],
    );
  }

  async function saveHandle() {
    if(!name.trim()) {
      Alert.alert('Manglende oplysninger', 'Du skal indtaste et navn.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Manglende oplysninger', 'Du skal indtaste en adresse.');
      return;
    }
    
    try {
      const { lat, lng } = await fetchCoordinates(location);
      await updateDoc(
        doc(database, "users", uid, "restaurants", restaurant.id),
        {
          name,
          category,
          cuisine,
          location,
          rating,
          notes,
          lat,
          lng,
        },
      );
      setIsEditing(false);
      navigation.goBack();
    } catch (error) {
      console.log("Fejl:", error);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Navn</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={styles.value}>{name}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Kategori</Text>
          {isEditing ? (
            <>
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
            </>
          ) : (
            <Text style={styles.value}>{category}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cuisine</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={cuisine}
              onChangeText={setCuisine}
            />
          ) : (
            <Text style={styles.value}>{cuisine}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Lokation</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
          ) : (
            <Text style={styles.value}>{location}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rating</Text>
          <Rating
            size={30}
            rating={rating}
            disabled={!isEditing}
            onChange={setRating}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Noter</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multiline]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.value}>{notes || "Ingen noter"}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={saveHandle}>
            <Text style={styles.buttonText}>Gem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelText}>Annuller</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Rediger</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteHandle}>
            <Text style={styles.buttonText}>Slet</Text>
          </TouchableOpacity>
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  editButton: {
    margin: 24,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
  },
  saveButton: {
    margin: 24,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
  },
  cancelButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  deleteButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#c0392b",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});
