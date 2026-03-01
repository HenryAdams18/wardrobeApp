import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';
import SAMPLE_WARDROBE_MALE from '../data/sampleWardrobeMale';
import SAMPLE_WARDROBE_FEMALE from '../data/sampleWardrobeFemale';

export default function OnboardingScreen({ navigation }) {
    const { addMultipleItems, setOnboardingComplete } = useContext(WardrobeContext);
    const [wardrobeChoice, setWardrobeChoice] = useState(null); // 'Sample' or null

    const handleSampleWardrobe = async (gender) => {
        let wardrobe = [];
        if (gender === 'Male') {
            wardrobe = SAMPLE_WARDROBE_MALE;
        } else if (gender === 'Female') {
            wardrobe = SAMPLE_WARDROBE_FEMALE;
        } else {
            wardrobe = [...SAMPLE_WARDROBE_MALE, ...SAMPLE_WARDROBE_FEMALE];
        }

        await addMultipleItems(wardrobe);
        await setOnboardingComplete(true, gender);
    };

    const handleEmptyWardrobe = async () => {
        await setOnboardingComplete(true, null);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>👕</Text>
                    <Text style={styles.title}>Smart Digital Wardrobe</Text>
                    <Text style={styles.subtitle}>
                        {!wardrobeChoice ? "How would you like to get started?" : "Select your style preference"}
                    </Text>
                </View>

                {/* Options */}
                {!wardrobeChoice ? (
                    <View style={styles.optionsContainer}>
                        {/* Option 1: Sample Wardrobe (dark card) */}
                        <TouchableOpacity
                            style={styles.cardDark}
                            onPress={() => setWardrobeChoice('Sample')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardDarkBadge}>
                                <Text style={styles.cardDarkBadgeText}>Recommended</Text>
                            </View>
                            <View style={styles.iconWrapDark}>
                                <Text style={styles.icon}>✨</Text>
                            </View>
                            <Text style={styles.cardDarkTitle}>Start with Sample Wardrobe</Text>
                            <Text style={styles.cardDarkDesc}>
                                Load pre-built items across all categories. Perfect for exploring app features straight away.
                            </Text>
                        </TouchableOpacity>

                        {/* Option 2: Empty Wardrobe (light card) */}
                        <TouchableOpacity
                            style={styles.cardLight}
                            onPress={handleEmptyWardrobe}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconWrapLight}>
                                <Text style={styles.icon}>📸</Text>
                            </View>
                            <Text style={styles.cardLightTitle}>Build My Own Wardrobe</Text>
                            <Text style={styles.cardLightDesc}>
                                Start fresh and add your own clothes by taking photos or choosing from your gallery.
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.cardLight} onPress={() => handleSampleWardrobe('Male')} activeOpacity={0.8}>
                            <View style={styles.iconWrapLight}><Text style={styles.icon}>👨</Text></View>
                            <Text style={styles.cardLightTitle}>Menswear</Text>
                            <Text style={styles.cardLightDesc}>Explore male sample clothing styles.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardLight} onPress={() => handleSampleWardrobe('Female')} activeOpacity={0.8}>
                            <View style={styles.iconWrapLight}><Text style={styles.icon}>👩</Text></View>
                            <Text style={styles.cardLightTitle}>Womenswear</Text>
                            <Text style={styles.cardLightDesc}>Explore female sample clothing styles.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardLight} onPress={() => handleSampleWardrobe('Fluid')} activeOpacity={0.8}>
                            <View style={styles.iconWrapLight}><Text style={styles.icon}>✨</Text></View>
                            <Text style={styles.cardLightTitle}>Gender Fluid</Text>
                            <Text style={styles.cardLightDesc}>Explore all sample clothing styles combined.</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Footer */}
                {wardrobeChoice === 'Sample' && (
                    <Text style={styles.footer}>
                        You can always add or remove items later from the Wardrobe tab.
                    </Text>
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
        padding: 24,
        justifyContent: 'center',
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },

    // Cards container
    optionsContainer: {
        gap: 16,
        marginBottom: 32,
    },

    // Dark card (sample wardrobe)
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        position: 'relative',
    },
    cardDarkBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cardDarkBadgeText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontWeight: '600',
    },
    iconWrapDark: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardDarkTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    cardDarkDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.65)',
        lineHeight: 20,
    },

    // Light card (build own)
    cardLight: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 24,
    },
    iconWrapLight: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardLightTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    cardLightDesc: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },

    // Shared
    icon: {
        fontSize: 24,
    },
    footer: {
        textAlign: 'center',
        color: '#aaa',
        fontSize: 13,
    },
});
