import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Digital Wardrobe</Text>
      <Text style={styles.subtitle}>Quick Outfit Generator</Text>

      <Text style={styles.sectionTitle}>Occasion</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}><Text>Casual</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>Uni / Work</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>Event</Text></TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Weather</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}><Text>Cold / Rainy</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>Warm / Dry</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Generate Outfit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  primaryButton: {
    marginTop: 40,
    backgroundColor: '#d0d0d0',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});