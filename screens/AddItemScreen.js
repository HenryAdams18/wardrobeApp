import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';
import * as ImagePicker from 'expo-image-picker';
import { classifyItem } from '../services/classifyItem';
import { removeBackground } from '../services/removeBackground';

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

export default function AddItemScreen({ navigation, route }) {
    const { addItem, addMultipleItems, updateItem, deleteItem } = useContext(WardrobeContext);
    const editingItem = route?.params?.item;

    const [name, setName] = useState(editingItem?.name || '');
    const [category, setCategory] = useState(editingItem?.category || 'Top');
    const [accessoryType, setAccessoryType] = useState(editingItem?.accessoryType || 'Hat / Cap');
    const [fit, setFit] = useState(editingItem?.fit || 'Regular');
    const [colour, setColour] = useState(editingItem?.colour || null);
    const [formality, setFormality] = useState(editingItem?.formality || 'Everyday');
    const [warmth, setWarmth] = useState(editingItem?.warmth || 'Transitional');
    const [length, setLength] = useState(editingItem?.length || 'Regular');
    const [imageUri, setImageUri] = useState(editingItem?.imageUri || null);
    const [localImage, setLocalImage] = useState(editingItem?.image || null);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [isClassifying, setIsClassifying] = useState(false);
    const [isRemovingBackground, setIsRemovingBackground] = useState(false);
    const [batchQueue, setBatchQueue] = useState([]);
    const [approvedItems, setApprovedItems] = useState([]);
    const [originalBatchSize, setOriginalBatchSize] = useState(0);
    const [autoFilledFields, setAutoFilledFields] = useState([]);

    const VALID_OPTIONS = {
        category: ['Top', 'Bottom', 'Outerwear', 'Full Body', 'Shoes', 'Accessory'],
        colour: COLOUR_OPTIONS.map(c => c.name),
        fit: ['Tight', 'Regular', 'Oversized'],
        formality: ['Casual', 'Everyday', 'Smart', 'Athletic'],
        warmth: ['Warm', 'Transitional', 'Cold'],
        length: ['Cropped', 'Regular', 'Long'],
        accessoryType: ['Hat / Cap', 'Bag / Backpack', 'Watch / Jewellery', 'Belt', 'Scarf', 'Sunglasses']
    };

    const handleClassification = async (uri) => {
        setIsClassifying(true);
        setAutoFilledFields([]);
        const result = await classifyItem(uri);
        setIsClassifying(false);

        if (!result || result.error) {
            Alert.alert("Auto-Detect Failed", "Detection failed. Please enter information manually.");
            return;
        }

        const filled = [];

        if (result.name && typeof result.name === 'string') {
            setName(result.name);
            filled.push('name');
        }
        if (VALID_OPTIONS.category.includes(result.category)) {
            setCategory(result.category);
            filled.push('category');
        }
        if (result.category === 'Accessory' && VALID_OPTIONS.accessoryType.includes(result.accessoryType)) {
            setAccessoryType(result.accessoryType);
            filled.push('accessoryType');
        }
        if (VALID_OPTIONS.colour.includes(result.colour)) {
            setColour(result.colour);
            filled.push('colour');
        }
        if (VALID_OPTIONS.fit.includes(result.fit)) {
            setFit(result.fit);
            filled.push('fit');
        }
        if (VALID_OPTIONS.formality.includes(result.formality)) {
            setFormality(result.formality);
            filled.push('formality');
        }
        if (VALID_OPTIONS.warmth.includes(result.warmth)) {
            setWarmth(result.warmth);
            filled.push('warmth');
        }
        if (VALID_OPTIONS.length.includes(result.length)) {
            setLength(result.length);
            filled.push('length');
        }

        setAutoFilledFields(filled);

        // Remove highlights after 2 seconds
        if (filled.length > 0) {
            setTimeout(() => {
                setAutoFilledFields([]);
            }, 2000);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            if (result.assets.length > 1) {
                const uris = result.assets.map(a => a.uri);
                setOriginalBatchSize(uris.length);
                setBatchQueue(uris);
                setApprovedItems([]);
                
                // Immediately kick off the first item
                setImageUri(uris[0]);
                setLocalImage(null);
                handleClassification(uris[0]);
            } else {
                const uri = result.assets[0].uri;
                setImageUri(uri);
                setLocalImage(null);
                handleClassification(uri);
            }
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
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            setLocalImage(null);
            handleClassification(uri);
        }
    };

    const handleRemoveBackground = async () => {
        let uriToProcess = imageUri;
        if (!uriToProcess && typeof localImage === 'string') uriToProcess = localImage;
        if (!uriToProcess && localImage?.uri) uriToProcess = localImage.uri;

        if (!uriToProcess) {
            Alert.alert("Cannot Process Image", "Please take a new photo or select one from the gallery first.");
            return;
        }

        setIsRemovingBackground(true);
        const result = await removeBackground(uriToProcess);
        setIsRemovingBackground(false);

        if (result && !result.error) {
            setImageUri(result);
            setLocalImage(null);
        } else {
            Alert.alert("Background Removal Failed", result?.error || "Could not remove background. Check your API key or internet connection.");
        }
    };

    const handleSave = () => {
        const itemData = {
            name: name || 'Untitled Item',
            category,
            accessoryType: category === 'Accessory' ? accessoryType : null,
            fit: category === 'Accessory' ? null : fit,
            colour,
            formality,
            warmth,
            length: category === 'Accessory' ? null : length,
            imageUri,
        };

        if (batchQueue.length > 0) {
            // We are processing a batch queue
            const newApproved = [...approvedItems, itemData];
            setApprovedItems(newApproved);

            const remainingQueue = batchQueue.slice(1);
            setBatchQueue(remainingQueue);

            if (remainingQueue.length > 0) {
                // Load the next item in the queue
                const nextUri = remainingQueue[0];
                setImageUri(nextUri);
                setLocalImage(null);
                setName(''); // Clear previous residual name
                handleClassification(nextUri);
            } else {
                // Batch is totally finished
                addMultipleItems(newApproved);
                Alert.alert(
                    "Batch Complete",
                    `Successfully added ${newApproved.length} items back to your wardrobe!`,
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            }
        } else {
            // Standard single item save logic
            if (editingItem) {
                updateItem(editingItem.id, itemData);
            } else {
                addItem(itemData);
            }
            navigation.goBack();
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this item from your wardrobe?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => {
                    deleteItem(editingItem.id);
                    navigation.goBack();
                }}
            ]
        );
    };

    // Reusable pill-button selector (same pattern as before)
    const SelectionGroup = ({ label, options, selected, onSelect, fieldKey }) => (
        <View style={[styles.inputGroup, autoFilledFields.includes(fieldKey) && styles.highlightedGroup]}>
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
        <View style={[styles.inputGroup, autoFilledFields.includes('colour') && styles.highlightedGroup]}>
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
                <Text style={styles.title}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>

                {/* Loading Overlay */}
                {isClassifying && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#1a1a1a" />
                        <Text style={styles.loadingText}>Detecting item details...</Text>
                    </View>
                )}

                {/* Image Upload */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Image</Text>
                    <View style={styles.imageButtonsContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.image} />
                            ) : localImage ? (
                                <Image source={localImage} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholderText}>Choose from Gallery</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.imagePicker, styles.cameraButton]} onPress={takePhoto}>
                            <Text style={styles.imagePlaceholderText}>📸 Take Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {(imageUri || localImage) && (
                        <TouchableOpacity 
                            style={styles.rmBgButton} 
                            onPress={handleRemoveBackground}
                            disabled={isRemovingBackground}
                        >
                            {isRemovingBackground ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.rmBgText}>✨ Remove Background</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Item Name */}
                <View style={[styles.inputGroup, autoFilledFields.includes('name') && styles.highlightedGroup]}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Navy Blue Blazer"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Category */}
                <SelectionGroup
                    label="Category"
                    options={VALID_OPTIONS.category}
                    selected={category}
                    onSelect={setCategory}
                    fieldKey="category"
                />

                {/* Sub-category if Accessory */}
                {category === 'Accessory' && (
                    <SelectionGroup
                        label="Accessory Type"
                        options={VALID_OPTIONS.accessoryType}
                        selected={accessoryType}
                        onSelect={setAccessoryType}
                        fieldKey="accessoryType"
                    />
                )}

                {/* Colour */}
                <ColourSelector />

                {/* Fit */}
                {category !== 'Accessory' && (
                    <SelectionGroup
                        label="Fit"
                        options={['Tight', 'Regular', 'Oversized']}
                        selected={fit}
                        onSelect={setFit}
                        fieldKey="fit"
                    />
                )}

                {/* Formality */}
                <SelectionGroup
                    label="Formality"
                    options={['Casual', 'Everyday', 'Smart', 'Athletic']}
                    selected={formality}
                    onSelect={setFormality}
                    fieldKey="formality"
                />

                {/* Warmth */}
                <SelectionGroup
                    label="Warmth"
                    options={['Warm', 'Transitional', 'Cold']}
                    selected={warmth}
                    onSelect={setWarmth}
                    fieldKey="warmth"
                />

                {/* Length */}
                {category !== 'Accessory' && (
                    <SelectionGroup
                        label="Length"
                        options={['Cropped', 'Regular', 'Long']}
                        selected={length}
                        onSelect={setLength}
                        fieldKey="length"
                    />
                )}

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>
                        {batchQueue.length > 1 
                            ? `Save & Next Item (${originalBatchSize - batchQueue.length + 1} of ${originalBatchSize})`
                            : batchQueue.length === 1 
                                ? 'Save Final Item & Finish Batch'
                                : editingItem 
                                    ? 'Update Item' 
                                    : 'Save to Wardrobe'
                        }
                    </Text>
                </TouchableOpacity>

                {editingItem && (
                    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                        <Text style={styles.deleteText}>Delete Item</Text>
                    </TouchableOpacity>
                )}

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
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    highlightedGroup: {
        backgroundColor: '#e6ffe6', // Light green flash
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
    loadingOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4ff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#d0ddff',
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#1B2A4A',
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
    rmBgButton: {
        marginTop: 14,
        backgroundColor: '#8a2be2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    rmBgText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
    deleteButton: {
        marginTop: 16,
        padding: 18,
        backgroundColor: '#ffebee',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    deleteText: {
        color: '#d32f2f',
        fontWeight: 'bold',
        fontSize: 16,
    },
});