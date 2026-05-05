import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Animated } from 'react-native';
import { WardrobeContext, defaultPreferences } from '../context/WardrobeContext';
import { maleStyleOutfits, femaleStyleOutfits } from '../data/styleProfileOutfits';
import SAMPLE_WARDROBE_MALE from '../data/sampleWardrobeMale';
import SAMPLE_WARDROBE_FEMALE from '../data/sampleWardrobeFemale';
import { calculateStyleProfile, profileToPreferences } from '../services/styleProfileCalculator';


export default function StyleProfileScreen({ route, navigation }) {
    const { gender } = route.params;
    const { setOnboardingComplete, preferences, updatePreference } = useContext(WardrobeContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const outfitData = gender === 'Female' ? femaleStyleOutfits : maleStyleOutfits;
    const allSampleItems = [...SAMPLE_WARDROBE_MALE, ...SAMPLE_WARDROBE_FEMALE];

    const currentOutfit = outfitData[currentIndex];

    const handleSkip = async () => {
        // Set defaults
        for (const [key, val] of Object.entries(defaultPreferences)) {
            await updatePreference(key, val);
        }
        await setOnboardingComplete(true, gender);
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleResponse = (score) => {
        const newResponses = [...responses, { outfitId: currentOutfit.id, score }];
        
        if (currentIndex < outfitData.length - 1) {
            setResponses(newResponses);
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                setCurrentIndex(prev => prev + 1);
                Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            });
        } else {
            setResponses(newResponses);
            setIsComplete(true);
            const profile = calculateStyleProfile(newResponses, outfitData);
            const newPrefs = profileToPreferences(profile);
            
            // Save preferences asynchronously then wait 1.5s to navigate
            (async () => {
                for (const [key, value] of Object.entries(newPrefs)) {
                    await updatePreference(key, value);
                }
                setTimeout(() => {
                    setOnboardingComplete(true, gender);
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }, 1500);
            })();
        }
    };

    if (isComplete) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, styles.completionContainer]}>
                    <Text style={styles.completionIcon}>✨</Text>
                    <Text style={styles.completionTitle}>Style profile created!</Text>
                    <Text style={styles.completionSub}>Your outfit suggestions will now be personalised to your taste.</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentOutfit) return null;

    const outfitItems = currentOutfit.itemIds.map(id => allSampleItems.find(i => i.id === id)).filter(Boolean);
    const topItem = outfitItems.find(i => i.category === 'Top' || i.category === 'Full Body');
    const bottomItem = topItem?.category === 'Full Body' ? null : outfitItems.find(i => i.category === 'Bottom');
    const shoesItem = outfitItems.find(i => i.category === 'Shoes');
    const outerwearItem = outfitItems.find(i => i.category === 'Outerwear');

    const renderGridItem = (item, fallbackLabel) => {
        if (!item) {
            return (
                <View style={[styles.gridCell, styles.placeholderCell]}>
                    {fallbackLabel && <Text style={styles.placeholderLabel}>{fallbackLabel}</Text>}
                </View>
            );
        }

        return (
            <View style={styles.gridCell}>
                {item.image || item.imageUri ? (
                    <Image source={item.image || { uri: item.imageUri }} style={styles.gridImage} resizeMode="contain" />
                ) : (
                    <View style={styles.placeholderImage} />
                )}
                <View style={styles.gridLabelContainer}>
                    <Text style={styles.gridLabel}>{item.category === 'Full Body' ? 'Full Body' : fallbackLabel}</Text>
                </View>
            </View>
        );
    };

    const progressPercentage = ((currentIndex + 1) / outfitData.length) * 100;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Top Section */}
                <View style={styles.topSection}>
                    <Text style={styles.progressText}>{currentIndex + 1} of {outfitData.length}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                    </View>
                    {currentIndex === 0 && (
                        <Text style={styles.instructionText}>Swipe through 12 outfits and tell us what you think. This helps us learn your style.</Text>
                    )}
                </View>

                {/* Middle Section: Card */}
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    <View style={styles.gridContainer}>
                        {renderGridItem(topItem, topItem?.category === 'Full Body' ? 'Full Body' : 'Top')}
                        {renderGridItem(bottomItem, topItem?.category === 'Full Body' ? null : 'Bottom')}
                        {renderGridItem(shoesItem, 'Shoes')}
                        {renderGridItem(outerwearItem, 'Outer')}
                    </View>
                    <Text style={styles.description}>{currentOutfit.description}</Text>
                </Animated.View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.greyButton]} onPress={() => handleResponse(-1)} activeOpacity={0.8}>
                            <Text style={styles.buttonEmoji}>👎</Text>
                            <Text style={styles.buttonLabel}>Dislike</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.actionButton, styles.greyButton]} onPress={() => handleResponse(0)} activeOpacity={0.8}>
                            <Text style={styles.buttonEmoji}>😐</Text>
                            <Text style={styles.buttonLabel}>Meh</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.actionButton, styles.darkButton]} onPress={() => handleResponse(1)} activeOpacity={0.8}>
                            <Text style={styles.buttonEmoji}>👍</Text>
                            <Text style={styles.buttonLabelLight}>Like</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip styling quiz</Text>
                    </TouchableOpacity>
                </View>

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
        justifyContent: 'space-between',
    },
    topSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1a1a1a',
    },
    instructionText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        justifyContent: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    gridCell: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: '4%',
        position: 'relative',
        overflow: 'hidden',
    },
    placeholderCell: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridLabelContainer: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    gridLabel: {
        fontSize: 11,
        color: '#999',
        fontWeight: '600',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    placeholderLabel: {
        fontSize: 11,
        color: '#ccc',
        fontWeight: '500',
    },
    placeholderImage: {
        flex: 1,
        backgroundColor: '#eee',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    bottomSection: {
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    actionButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greyButton: {
        backgroundColor: '#f5f5f5',
    },
    darkButton: {
        backgroundColor: '#1a1a1a',
    },
    buttonEmoji: {
        fontSize: 20,
        marginBottom: 2,
    },
    buttonLabel: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
    },
    buttonLabelLight: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    completionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    completionIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    completionSub: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
    },
    skipButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    skipText: {
        fontSize: 15,
        color: '#999',
        fontWeight: '600',
    },
});
