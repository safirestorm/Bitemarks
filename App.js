import { app } from './firebase';
import { RootStack } from './components/Navigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  return (
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
  );
}


