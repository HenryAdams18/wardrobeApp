import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';

export default function AddItemScreen({ navigation }) {
    const { addItem } = useContext(WardrobeContext);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('Top');
    const [fit, setFit] = useState('Regular');

    const handleSave = () => {
        addItem({
            name: name || 'Untitled Item',
            category,
            fit,
        });
        navigation.goBack();
    };

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Add New Item</Text>

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

                <SelectionGroup
                    label="Category"
                    options={['Top', 'Bottom', 'Shoes']}
                    selected={category}
                    onSelect={setCategory}
                />

                <SelectionGroup
                    label="Fit"
                    options={['Tight', 'Regular', 'Oversized']}
                    selected={fit}
                    onSelect={setFit}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Save to Wardrobe</Text>
                </TouchableOpacity>
            </View>
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
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
    saveButton: {
        marginTop: 'auto',
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