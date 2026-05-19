import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { auth, database } from "../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Rating } from '@kolking/react-native-rating';

export function CreatePage() {
  const uid = auth.currentUser.uid; // Saves the users id in a variable
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')

  async function addRestaurant(){
    await addDoc(collection(database, "users", uid, "restaurants"), {
      name: name,
      category: category,
      location: location,
      rating: rating,
      notes: notes
    })
  }

  return(
    <ScrollView contentContainerStyle={styles.container}>   
      <Text style={styles.title}>Tilføj spisested</Text>

      <Text style={styles.label}>Navn</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Navn" />

      <Text style={styles.label}>Kategori</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Kategori" />

      <Text style={styles.label}>Adresse</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Adresse" />

      <Text style={styles.label}>Rating</Text>
      <Rating size={40} rating={rating} onChange={(value) => setRating(value)}/>

      <Text style={styles.label}>Noter</Text>
      <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Kommentarer..." multiline numberOfLines={4} />

      <TouchableOpacity style={styles.button} onPress={addRestaurant}>
        <Text style={styles.buttonText}>Gem spisested</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
      padding: 24,
      backgroundColor: '#fff',
  },
  title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 24,
  },
  label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      color: '#333',
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
  },
  multiline: {
      height: 100,
      textAlignVertical: 'top',
  },
  button: {
      backgroundColor: '#000',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
      },
  buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
},
});