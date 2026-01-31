import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import WardrobeScreen from './screens/WardrobeScreen';
import OutfitResultsScreen from './screens/OutfitResultsScreen';
import AddItemScreen from './screens/AddItemScreen';

import { WardrobeProvider } from './context/WardrobeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Outfits" component={OutfitResultsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <WardrobeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddItem"
            component={AddItemScreen}
            options={{ title: 'Add Item' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WardrobeProvider>
  );
}