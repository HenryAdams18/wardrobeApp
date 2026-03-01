import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';
import { useNavigation } from '@react-navigation/native';

export default function OutfitResultsScreen() {
  const {
    generatedOutfits,
    activeOutfitIndex,
    setActiveOutfitIndex,
    currentOutfit,
    generateOutfitOptions,
    saveOutfit,
    swapItem,
    weather,
  } = useContext(WardrobeContext);
  const navigation = useNavigation();

  const handleSave = () => {
    if (!currentOutfit) return;
    saveOutfit(currentOutfit);

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          state: {
            routes: [{ name: 'Saved' }],
          },
        },
      ],
    });
  };

  const handleRegenerate = () => {
    const error = generateOutfitOptions();
    if (error) {
      Alert.alert("Can't Generate", error);
    }
  };

  const handleSwap = (slot) => {
    swapItem(slot);
  };

  if (!currentOutfit) return null;

  const temperature = weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your Look</Text>
            {temperature && (
              <Text style={styles.weatherTag}>🌡 {temperature} — weather adjusted</Text>
            )}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>❤️ Save</Text>
          </TouchableOpacity>
        </View>

        {/* Outfit option indicators */}
        <View style={styles.optionRow}>
          {generatedOutfits.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionTab,
                activeOutfitIndex === index && styles.optionTabActive,
              ]}
              onPress={() => setActiveOutfitIndex(index)}
            >
              <Text style={[
                styles.optionTabText,
                activeOutfitIndex === index && styles.optionTabTextActive,
              ]}>
                Option {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Outfit cards with swap buttons */}
        <View style={styles.outfitGrid}>
          {currentOutfit.outerwear && (
            <OutfitCard item={currentOutfit.outerwear} label="Outerwear" onSwap={() => handleSwap('outerwear')} />
          )}
          {currentOutfit.fullBody ? (
            <OutfitCard item={currentOutfit.fullBody} label="Full Body" onSwap={() => handleSwap('fullBody')} />
          ) : (
            <>
              <OutfitCard item={currentOutfit.top} label="Top" onSwap={() => handleSwap('top')} />
              <OutfitCard item={currentOutfit.bottom} label="Bottom" onSwap={() => handleSwap('bottom')} />
            </>
          )}
          <OutfitCard item={currentOutfit.shoes} label="Shoes" onSwap={() => handleSwap('shoes')} />
        </View>

        {/* Regenerate button */}
        <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
          <Text style={styles.regenerateButtonText}>🔄 Regenerate All</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function OutfitCard({ item, label, onSwap }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        ) : (
          <Text style={styles.noImageText}>No Image</Text>
        )}
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardFit}>{item.fit} Fit</Text>
      </View>
      <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
        <Text style={styles.swapButtonText}>↻ Swap</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  weatherTag: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#ffeaea',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },

  // ─── Option tabs ───────────────────────────────
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  optionTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  optionTabActive: {
    backgroundColor: '#1a1a1a',
  },
  optionTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  optionTabTextActive: {
    color: '#fff',
  },

  // ─── Outfit cards ──────────────────────────────
  outfitGrid: {
    gap: 12,
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
    width: 72,
    height: 72,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 10,
    color: '#999',
  },
  cardDetails: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  cardFit: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  swapButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  swapButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },

  // ─── Regenerate ────────────────────────────────
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
});