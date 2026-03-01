import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { WardrobeContext } from '../context/WardrobeContext';

export default function HomeScreen({ navigation }) {
  const { updateWeather, weather } = useContext(WardrobeContext);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();

      // Store weather in context so outfit engine can use it
      updateWeather(data.current_weather);
    } catch (e) {
      setErrorMsg("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const getSuggestion = (temp) => {
    if (temp < 10) return "It's freezing! Wear a coat and scarf 🧥";
    if (temp < 20) return "A bit chilly. A jumper or hoodie is perfect 🧤";
    return "It's warm! T-shirt weather ☀️";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Day,</Text>
        <Text style={styles.username}>Henry</Text>
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : errorMsg ? (
          <Text style={styles.weatherError}>{errorMsg}</Text>
        ) : weather ? (
          <>
            <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
            <Text style={styles.condition}>{getSuggestion(weather.temperature)}</Text>
          </>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text style={styles.actionEmoji}>➕</Text>
          <Text style={styles.actionText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Wardrobe')}
        >
          <Text style={styles.actionEmoji}>👕</Text>
          <Text style={styles.actionText}>Wardrobe</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title="DEV: Reset App Data"
          color="red"
          onPress={async () => {
            await AsyncStorage.clear();
            Alert.alert('Data cleared!', 'Please reload the app (Press "r" in terminal).');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#666',
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  weatherCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    height: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  condition: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 8,
  },
  weatherError: {
    color: '#ffa5a5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '600',
    color: '#333',
  },
});