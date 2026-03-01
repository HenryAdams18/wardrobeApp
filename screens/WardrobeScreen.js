import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WardrobeContext } from '../context/WardrobeContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';

export default function WardrobeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isActivityModalVisible, setActivityModalVisible] = useState(false);
  const { wardrobeItems, generateOutfitOptions, deleteItem } = useContext(WardrobeContext);
  const navigation = useNavigation();

  const handleGenerateClick = () => {
    setActivityModalVisible(true);
  };

  const executeGenerateOutfit = (activity) => {
    const error = generateOutfitOptions(activity);
    if (error) {
      Alert.alert("Can't Generate", error);
      return;
    }
    setActivityModalVisible(false);
    navigation.navigate('OutfitResults');
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to remove this item from your wardrobe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteItem(id) }
      ]
    );
  };

  const filteredItems =
    selectedCategory === 'All'
      ? wardrobeItems
      : wardrobeItems.filter(
        item => item.category === selectedCategory
      );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => confirmDelete(item.id)}
      delayLongPress={500}
    >
      <View style={styles.imagePlaceholder}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        ) : (
          <Text style={styles.imageText}>No Image</Text>
        )}
      </View>
      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.itemFit}>{item.fit}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Wardrobe</Text>
        <Text style={styles.subtitle}>
          All your clothing items in one place
        </Text>

        {/* Filters */}
        <View style={styles.filterRow}>
          {['All', 'Top', 'Bottom', 'Shoes', 'Outerwear', 'Full Body'].map(category => (
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
            onPress={handleGenerateClick}
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

      {/* Activity Picker Modal */}
      <Modal
        visible={isActivityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActivityModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Occasion</Text>
              <Text style={styles.modalSubtitle}>What are you dressing for?</Text>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              {['Casual', 'Uni / Work', 'Night Out / Date', 'Formal Event', 'Gym / Sport'].map(act => (
                <TouchableOpacity
                  key={act}
                  style={styles.modalOptionButton}
                  onPress={() => executeGenerateOutfit(act)}
                >
                  <Text style={styles.modalOptionText}>{act}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActivityModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#d0d0d0',
  },
  list: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    maxWidth: '48%',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageText: {
    fontSize: 12,
    color: '#999',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
    color: '#333',
  },
  itemFit: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  generateButton: {
    flex: 2,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
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
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  modalScroll: {
    maxHeight: 350,
  },
  modalScrollContent: {
    gap: 12,
    paddingBottom: 20,
  },
  modalOptionButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseBtn: {
    marginTop: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
});