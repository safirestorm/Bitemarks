import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { useState } from "react";

export function MapPage() {
  // Bestemmer hvilken andel af verdenen kortet viser
  const [region, setRegion] = useState({
    latitude:55.5,
    longitude:10.5,
    latitudeDelta:6,  // Delta = Hvor mange grader vi skal vise/Hvor meget Zoom
    longitudeDelta:6 
  })

  return(
    <View>
      <MapView 
        style={styles.map}
        region={region}
      >
          
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