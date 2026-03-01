import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import WardrobeScreen from './screens/WardrobeScreen';
import SavedOutfitsScreen from './screens/SavedOutfitsScreen';
import OutfitResultsScreen from './screens/OutfitResultsScreen';
import AddItemScreen from './screens/AddItemScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import { WardrobeProvider, WardrobeContext } from './context/WardrobeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1a1a1a' }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Saved" component={SavedOutfitsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isOnboardingComplete } = useContext(WardrobeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingComplete ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddItem"
              component={AddItemScreen}
              options={{ title: 'Add Item' }}
            />
            <Stack.Screen
              name="OutfitResults"
              component={OutfitResultsScreen}
              options={{ presentation: 'modal', title: 'Generated Outfit' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <WardrobeProvider>
      <AppNavigator />
    </WardrobeProvider>
  );
}