import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
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
    swapAccessory,
    removeAccessory,
    weather,
    adjustItemScore,
  } = useContext(WardrobeContext);
  const navigation = useNavigation();

  const [ratedOutfits, setRatedOutfits] = useState({});

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
    } else {
      setRatedOutfits({});
    }
  };

  const handleSwap = (slot) => {
    swapItem(slot);
  };

  const handleSwapAccessory = (index) => {
    swapAccessory(index);
  };

  const handleDismissAccessory = (index) => {
    removeAccessory(index);
  };

  const handleRate = async (type) => { // 'up' or 'down'
    if (!currentOutfit || ratedOutfits[activeOutfitIndex]) return;

    // Determine the items to boost/penalize
    const items = [
      currentOutfit.top,
      currentOutfit.bottom,
      currentOutfit.shoes,
      currentOutfit.outerwear,
      currentOutfit.fullBody
    ].filter(Boolean); // Filter out nulls/undefined

    const itemIds = items.map(item => item.id);
    const adjustmentValue = type === 'up' ? 0.3 : -0.2;

    await adjustItemScore(itemIds, adjustmentValue);

    setRatedOutfits(prev => ({
      ...prev,
      [activeOutfitIndex]: type
    }));
  };

  if (!currentOutfit) return null;

  const temperature = weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Your Look</Text>
            {temperature && (
              <Text style={styles.weatherTag}>🌡 {temperature} — weather adjusted</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.rateButton, ratedOutfits[activeOutfitIndex] === 'up' && styles.rateButtonActive]}
              onPress={() => handleRate('up')}
              disabled={!!ratedOutfits[activeOutfitIndex]}
            >
              <Text style={styles.rateButtonText}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rateButton, ratedOutfits[activeOutfitIndex] === 'down' && styles.rateButtonActive]}
              onPress={() => handleRate('down')}
              disabled={!!ratedOutfits[activeOutfitIndex]}
            >
              <Text style={styles.rateButtonText}>👎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>❤️ Save</Text>
            </TouchableOpacity>
          </View>
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
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.outfitGrid} showsVerticalScrollIndicator={false}>
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
          
          {currentOutfit.accessories && currentOutfit.accessories.length > 0 && (
            <View style={styles.accessoriesSection}>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>SUGGESTED ACCESSORIES</Text>
              {currentOutfit.accessories.map((acc, index) => (
                <AccessoryCard 
                  key={acc.id || index} 
                  item={acc} 
                  onSwap={() => handleSwapAccessory(index)} 
                  onDismiss={() => handleDismissAccessory(index)} 
                />
              ))}
            </View>
          )}
        </ScrollView>

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
        {item.image || item.imageUri ? (
          <Image source={item.image || { uri: item.imageUri }} style={styles.itemImage} />
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

function AccessoryCard({ item, onSwap, onDismiss }) {
  // A safe fallback for missing colours so it renders a neutral dot
  const dotColor = item.colour ? item.colour.toLowerCase() : '#ccc';
  return (
    <View style={styles.accessoryCard}>
      <View style={styles.accessoryImagePlaceholder}>
        {item.image || item.imageUri ? (
          <Image source={item.image || { uri: item.imageUri }} style={styles.itemImage} />
        ) : (
          <Text style={styles.noImageText}>No Image</Text>
        )}
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.accessoryLabel}>{item.accessoryType}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <View style={styles.colourRow}>
            <View style={[styles.colourDot, { backgroundColor: dotColor }]} />
            <Text style={styles.cardFit}>{item.colour || 'Neutral'}</Text>
        </View>
      </View>
      <View style={styles.accActions}>
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
          <Text style={styles.swapButtonText}>↻ Swap</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  rateButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  rateButtonActive: {
    backgroundColor: '#d0d0d0',
    opacity: 0.6,
  },
  rateButtonText: {
    fontSize: 16,
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
  scrollContainer: {
    flex: 1,
    marginBottom: 16,
  },
  outfitGrid: {
    gap: 12,
    paddingBottom: 20,
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
  accessoriesSection: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  accessoryCard: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  accessoryImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  accessoryLabel: {
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  colourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colourDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  dismissButton: {
    padding: 2,
    marginBottom: 8,
  },
  dismissText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
});