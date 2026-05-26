import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginPage from "./LoginPage";
import { HomePage } from "./HomePage";
import { DetailsPage } from "./DetailPage";
import { CreatePage } from "./CreatePage";
import ProfilePage from "./ProfilePage";
import { MapPage } from "./MapPage";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailsPage}
        options={{
          title: "Detaljer",
          presentation: Platform.OS === "ios" ? "formSheet" : "card",
          sheetAllowedDetents:
            Platform.OS === "ios" ? "fitToContents" : undefined,
          sheetGrabberVisible: Platform.OS === "ios" ? true : undefined,
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreatePage}
        options={{ title: "Tilføj Spisested" }}
      />
    </Stack.Navigator>
  );
}

export function BottomTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          title: "Startside",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapPage}
        options={{
          title: "Kort",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: "Min side",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
