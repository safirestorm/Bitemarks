import { app, database } from './firebase';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainPage } from './components/MainPage';
import { DetailsPage } from './components/DetailPage';
import { CreatePage } from './components/CreatePage';
import { collection, addDoc } from 'firebase/firestore';

const Stack = createNativeStackNavigator();


export default function App() {
  alert(JSON.stringify(database, null, 4))



  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Main' component={MainPage} />
        <Stack.Screen name='Detail' component={DetailsPage} />
        <Stack.Screen name='Create' component={CreatePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
