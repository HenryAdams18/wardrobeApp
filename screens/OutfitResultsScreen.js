import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';

export default function OutfitResultsScreen() {
  const { currentOutfit, generateOutfit } = useContext(WardrobeContext);

  if (!currentOutfit) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.placeholderText}>No outfit generated yet.</Text>
        <TouchableOpacity style={styles.button} onPress={generateOutfit}>
          <Text style={styles.buttonText}>Generate Outfit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Outfit Look</Text>
        <Text style={styles.subtitle}>Generated just for you</Text>

        <View style={styles.outfitGrid}>
          <OutfitCard item={currentOutfit.top} label="Top" />
          <OutfitCard item={currentOutfit.bottom} label="Bottom" />
          <OutfitCard item={currentOutfit.shoes} label="Shoes" />
        </View>

        <TouchableOpacity style={styles.regenerateButton} onPress={generateOutfit}>
          <Text style={styles.regenerateButtonText}>🔄 Regenerate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function OutfitCard({ item, label }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text>Image</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardFit}>{item.fit} Fit</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  outfitGrid: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardFit: {
    fontSize: 14,
    color: '#666',
  },
  regenerateButton: {
    marginTop: 'auto',
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  regenerateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});