import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { WardrobeContext } from '../context/WardrobeContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const initialWardrobe = [
  { id: '1', name: 'Black Jumper', category: 'Top', fit: 'Oversized' },
  { id: '2', name: 'White T-Shirt', category: 'Top', fit: 'Regular' },
  { id: '3', name: 'Blue Jeans', category: 'Bottom', fit: 'Regular' },
  { id: '4', name: 'Grey Trousers', category: 'Bottom', fit: 'Loose' },
  { id: '5', name: 'White Trainers', category: 'Shoes', fit: 'Regular' },
];

export default function WardrobeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { wardrobeItems, generateOutfit } = useContext(WardrobeContext);
  const navigation = useNavigation();

  const handleGenerateOutfit = () => {
    generateOutfit();
    navigation.navigate('Outfits');
  };

  const filteredItems =
    selectedCategory === 'All'
      ? wardrobeItems
      : wardrobeItems.filter(
        item => item.category === selectedCategory
      );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Image</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemFit}>{item.fit}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wardrobe</Text>
      <Text style={styles.subtitle}>
        All your clothing items in one place
      </Text>

      {/* Filters */}
      <View style={styles.filterRow}>
        {['All', 'Top', 'Bottom', 'Shoes'].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wardrobe Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateOutfit}
        >
          <Text style={styles.generateButtonText}>✨ Generate Outfit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>
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
  },
  subtitle: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#c0c0c0',
  },
  list: {
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 80,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageText: {
    fontSize: 12,
    color: '#555',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemFit: {
    fontSize: 12,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  generateButton: {
    flex: 2,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  generateButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});