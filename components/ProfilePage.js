import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, database, storage } from "../firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigation.replace("Login");
        return;
      }
      setUser(firebaseUser);
      setPhotoURL(firebaseUser.photoURL);

      try {
        const snap = await getDoc(doc(database, "users", firebaseUser.uid));
        if (snap.exists()) {
          setUsername(snap.data().username ?? "");
        }
      } catch (e) {
        console.log("Fejl i Firestore", e);
      }
    });
    return unsubscribe;
  }, []);

  async function pickAndUploadImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Giv adgang til dine billeder");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setUploading(true);
    try {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      await setDoc(
        doc(database, "users", user.uid),
        { photoURL: downloadURL },
        { merge: true },
      );

      setPhotoURL(downloadURL);
      Alert.alert("Profilbillede gemt");
    } catch (e) {
      Alert.alert("Fejl", "Kunne ikke uploade billede: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveUsername() {
    if (!username.trim()) return;
    setSaving(true);
    try {
      await setDoc(
        doc(database, "users", user.uid),
        { username: username.trim() },
        { merge: true },
      );
      Alert.alert("Brugernavn opdateret");
    } catch (e) {
      Alert.alert("Fejl", e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    navigation.replace("Login");
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        backgroundColor: "#fff",
        flexGrow: 1,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#e0e0e0",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: "bold", color: "#666" }}>
                {user.email?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {uploading ? (
          <ActivityIndicator style={{ marginTop: 8 }} />
        ) : (
          <TouchableOpacity
            onPress={pickAndUploadImage}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: "#555", fontSize: 13 }}>Skift billede</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={labelStyle}>Email</Text>
      <Text style={valueStyle}>{user.email}</Text>

      <Text style={[labelStyle, { marginTop: 20 }]}>Brugernavn</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          marginBottom: 8,
        }}
        value={username}
        onChangeText={setUsername}
        placeholder="Indtast brugernavn"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          borderRadius: 8,
          padding: 12,
          alignItems: "center",
          marginBottom: 32,
        }}
        onPress={saveUsername}
        disabled={saving}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {saving ? "Gemmer..." : "Gem brugernavn"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: "red", textAlign: "center", fontSize: 15 }}>
          Log ud
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const labelStyle = {
  fontSize: 12,
  color: "#888",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const valueStyle = { fontSize: 16, color: "#111", marginBottom: 4 };
