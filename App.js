import { app } from './firebase';
import { RootStack } from './components/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { Keyboard } from 'react-native';

// Quick error handling because react-native-elements uses an old Keyboard API
if (!Keyboard.removeListener) {
  Keyboard.removeListener = () => {};
}

export default function App() {

  return (
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
  );
}


