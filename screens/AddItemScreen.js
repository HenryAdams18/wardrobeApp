import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Image, ScrollView } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';
import * as ImagePicker from 'expo-image-picker';

// Colour palette with display hex values for the circle selectors
const COLOUR_OPTIONS = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#FAFAFA' },
    { name: 'Grey', hex: '#9E9E9E' },
    { name: 'Navy', hex: '#1B2A4A' },
    { name: 'Beige', hex: '#D4C5A9' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Red', hex: '#D32F2F' },
    { name: 'Blue', hex: '#1976D2' },
    { name: 'Green', hex: '#388E3C' },
    { name: 'Brown', hex: '#6D4C41' },
    { name: 'Pink', hex: '#E91E90' },
    { name: 'Yellow', hex: '#FBC02D' },
    { name: 'Orange', hex: '#F57C00' },
    { name: 'Purple', hex: '#7B1FA2' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Maroon', hex: '#800000' },
];

export default function AddItemScreen({ navigation }) {
    const { addItem } = useContext(WardrobeContext);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('Top');
    const [fit, setFit] = useState('Regular');
    const [colour, setColour] = useState(null);
    const [formality, setFormality] = useState('Everyday');
    const [warmth, setWarmth] = useState('Transitional');
    const [length, setLength] = useState('Regular');
    const [imageUri, setImageUri] = useState(null);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        addItem({
            name: name || 'Untitled Item',
            category,
            fit,
            colour,
            formality,
            warmth,
            length,
            imageUri,
        });
        navigation.goBack();
    };

    // Reusable pill-button selector (same pattern as before)
    const SelectionGroup = ({ label, options, selected, onSelect }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.selectionContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.optionButton,
                            selected === option && styles.optionButtonActive
                        ]}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={[
                            styles.optionText,
                            selected === option && styles.optionTextActive
                        ]}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    // Colour selector using coloured circles
    const ColourSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Colour</Text>
            <View style={styles.colourGrid}>
                {COLOUR_OPTIONS.map((c) => (
                    <TouchableOpacity
                        key={c.name}
                        style={[
                            styles.colourCircle,
                            { backgroundColor: c.hex },
                            c.name === 'White' && styles.colourCircleWhite,
                            colour === c.name && styles.colourCircleActive,
                        ]}
                        onPress={() => setColour(c.name)}
                    >
                        {colour === c.name && (
                            <Text style={[
                                styles.colourCheck,
                                (c.name === 'White' || c.name === 'Cream' || c.name === 'Yellow' || c.name === 'Beige') && styles.colourCheckDark
                            ]}>✓</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            {colour && (
                <Text style={styles.colourLabel}>Selected: {colour}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Add New Item</Text>

                {/* Image Upload */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Image</Text>
                    <View style={styles.imageButtonsContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholderText}>Choose from Gallery</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.imagePicker, styles.cameraButton]} onPress={takePhoto}>
                            <Text style={styles.imagePlaceholderText}>📸 Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Item Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Navy Blue Blazer"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Category — now includes Outerwear & Full Body */}
                <SelectionGroup
                    label="Category"
                    options={['Top', 'Bottom', 'Outerwear', 'Full Body', 'Shoes']}
                    selected={category}
                    onSelect={setCategory}
                />

                {/* Colour */}
                <ColourSelector />

                {/* Fit */}
                <SelectionGroup
                    label="Fit"
                    options={['Tight', 'Regular', 'Oversized']}
                    selected={fit}
                    onSelect={setFit}
                />

                {/* Formality */}
                <SelectionGroup
                    label="Formality"
                    options={['Casual', 'Everyday', 'Smart', 'Athletic']}
                    selected={formality}
                    onSelect={setFormality}
                />

                {/* Warmth */}
                <SelectionGroup
                    label="Warmth"
                    options={['Warm', 'Transitional', 'Cold']}
                    selected={warmth}
                    onSelect={setWarmth}
                />

                {/* Length */}
                <SelectionGroup
                    label="Length"
                    options={['Cropped', 'Regular', 'Long']}
                    selected={length}
                    onSelect={setLength}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Save to Wardrobe</Text>
                </TouchableOpacity>

                {/* Bottom spacing so save button isn't flush against edge */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1a1a1a',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    textInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#eee',
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    imagePicker: {
        width: 120,
        height: 120,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    cameraButton: {
        backgroundColor: '#eef',
        borderColor: '#aad',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholderText: {
        color: '#999',
        fontSize: 12,
        fontWeight: '600',
    },
    selectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionButtonActive: {
        backgroundColor: '#1a1a1a',
        borderColor: '#1a1a1a',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    optionTextActive: {
        color: '#fff',
    },
    // Colour circle selector styles
    colourGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colourCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colourCircleWhite: {
        borderColor: '#ddd',
    },
    colourCircleActive: {
        borderColor: '#1a1a1a',
        borderWidth: 3,
    },
    colourCheck: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    colourCheckDark: {
        color: '#1a1a1a',
    },
    colourLabel: {
        marginTop: 8,
        fontSize: 13,
        color: '#888',
    },
    saveButton: {
        marginTop: 12,
        padding: 18,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});