import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from 'expo-location'
import { auth, database } from "../firebase";
import { doc, collection } from "firebase/firestore"
import { useCollection } from 'react-firebase-hooks/firestore'

export function MapPage({ navigation }) {
  const uid = auth.currentUser.uid; // Saves the users id in a variable
  const [values, loading, error] = useCollection(collection(database, "users", uid, "restaurants"))
  const data = values?.docs.map((doc)=>({...doc.data(), id:doc.id})) ?? []

  // Bestemmer hvilken andel af verdenen kortet viser
  const [region, setRegion] = useState({
    latitude:55.5,
    longitude:10.5,
    latitudeDelta:6,  // Delta = Hvor mange grader vi skal vise/Hvor meget Zoom
    longitudeDelta:6 
  })

  // useRef kan holde en reference på tværs af renderings dvs at den ikke forsager en ny rendering når den ændres (som useState)
  const mapView = useRef(null) // ref. til map view objektet
  const locationSubscription = useRef(null) // når vi lukker appen, skal den ikke lytte mere

  // useEffect kører hvor mange gange vi bestemmer og lukker ting vi har started ned når vi lukker appen
  useEffect(() =>{
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        alert("ingen adgang til lokation")
        return
      }
      locationSubscription.current = await Location.watchPositionAsync({
        distanceInterval: 100,
        accuracy: Location.Accuracy.Highest
      }, (location) =>{
        const newRegion = {
          latitude:location.coords.latitude,
          longitude:location.coords.longitude,
          latitudeDelta:3, 
          longitudeDelta:3
        }
        setRegion(newRegion) // flytter kortet til den nye location
        if(mapView.current){
          mapView.current.animateToRegion(newRegion)
        }
      })
    }
    startListening()
    return () =>{
      if(locationSubscription.current){
        locationSubscription.current.remove()
      }
    }
  }, []) // Et tomt array i slutningen betyder at denne useEffect kun skal køre én gang

  function addPlace(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate
    navigation.navigate('Create', { latitude, longitude })
  }

  function onPlacePressed(text) {
     // Skal tilføjes en metode til hvad der skal vises når man trykker på en pin 
  }

  return(
    <View>
      <MapView 
        style={styles.map}
        region={region}
        onLongPress={addPlace}
      >
        {data.map(restaurant =>(
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.lat, longitude: restaurant.lng }}
            title={restaurant.name}
            onPress={() => navigation.navigate('Detail', { restaurant })}
          />
        ))}   
      </MapView> 
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width:'100%',
    height:'100%'
  }
})