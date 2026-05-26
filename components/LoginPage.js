import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { database, auth } from "../firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  signInWithCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage({ navigation }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [enteredUsername, setEnteredUsername] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token, access_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUserId(userCredential.user.uid);
          navigation.replace("Tabs");
        })
        .catch((error) => console.log("Google login error: " + error));
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  async function login() {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword,
      );
      setUserId(credentials.user.uid);
      navigation.replace("Tabs");
    } catch (error) {
      Alert.alert("Login fejlede", error.message);
    }
  }

  async function signup() {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword,
      );
      await setDoc(doc(database, "users", credentials.user.uid), {
        uid: credentials.user.uid,
        username: enteredUsername,
        email: enteredEmail,
        createdAt: new Date(),
      });
      navigation.replace("Tabs");
    } catch (error) {
      Alert.alert("Oprettelse fejlede", error.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 24 }}>
        {isLogin ? "Log ind" : "Opret konto"}
      </Text>

      {!isLogin && (
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
          placeholder="Brugernavn"
          autoCapitalize="none"
          value={enteredUsername}
          onChangeText={setEnteredUsername}
        />
      )}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={enteredEmail}
        onChangeText={setEnteredEmail}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
        placeholder="Adgangskode"
        secureTextEntry
        value={enteredPassword}
        onChangeText={setEnteredPassword}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          borderRadius: 8,
          padding: 14,
          alignItems: "center",
          marginBottom: 12,
        }}
        onPress={isLogin ? login : signup}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {isLogin ? "Log ind" : "Opret"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={{ textAlign: "center", color: "#555" }}>
          {isLogin ? "Opret konto" : "Log ind"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
