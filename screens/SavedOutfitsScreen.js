import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';

export default function SavedOutfitsScreen() {
    const { savedOutfits, deleteOutfit } = useContext(WardrobeContext);

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Outfit",
            "Are you sure you want to remove this look?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteOutfit(id) }
            ]
        );
    };

    const renderOutfit = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imagesRow}>
                {item.fullBody ? (
                    <ImagePart item={item.fullBody} />
                ) : (
                    <>
                        <ImagePart item={item.top} />
                        <ImagePart item={item.bottom} />
                    </>
                )}
                <ImagePart item={item.shoes} />
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                    {new Date(item.generatedAt).toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const ImagePart = ({ item }) => {
        if (!item) return null;
        return (
            <View style={styles.imageContainer}>
                {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Saved Looks</Text>

                {savedOutfits.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No saved outfits yet.</Text>
                        <Text style={styles.emptySubtext}>Go to your Wardrobe and generate some looks!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={savedOutfits}
                        keyExtractor={item => item.id}
                        renderItem={renderOutfit}
                        contentContainerStyle={styles.list}
                    />
                )}
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
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1a1a1a',
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    imagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 8,
    },
    imageContainer: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ddd',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
    },
    deleteText: {
        color: '#ff4444',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#666',
    },
});
