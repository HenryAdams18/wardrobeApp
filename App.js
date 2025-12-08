import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen from './screens/WardrobeScreen';
import AddItemScreen from './screens/AddItemScreen';
import OutfitScreen from './screens/OutfitScreen';


//Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Wardrobe">
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
        <Stack.Screen name="Add Item" component={AddItemScreen} />
        <Stack.Screen name="Outfit" component={OutfitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});