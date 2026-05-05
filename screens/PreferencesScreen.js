import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { WardrobeContext } from '../context/WardrobeContext';

const DIMENSION_LABELS = {
    fitCombination: {
        'oversized-slim': 'Oversized top + slim bottom',
        'slim-wide': 'Slim top + wide bottom',
        'matched': 'Matched fit proportions',
        'no-preference': 'No strong preference'
    },
    colourPalette: {
        'neutral': 'Neutral palette',
        'earth-tones': 'Earth tones',
        'bold-colourful': 'Bold and colourful',
        'monochromatic': 'Monochromatic palette',
        'no-preference': 'No strong preference'
    },
    proportionPreference: {
        'cropped-long': 'Cropped top + long bottom',
        'long-slim': 'Long top + slim bottom',
        'balanced': 'Balanced proportions',
        'no-preference': 'No strong preference'
    },
    formalityZone: {
        'casual': 'Casual',
        'smart': 'Smart',
        'mixed': 'Mixed formality',
        'no-preference': 'No strong preference'
    },
    layeringTendency: {
        'likes-layers': 'Likes layers',
        'minimal': 'Minimal layering',
        'no-preference': 'No strong preference'
    },
    outfitType: {
        'standard': 'Standard (Top + Bottom)',
        'full-body': 'Full body (Dresses/Jumpsuits)',
        'no-preference': 'No strong preference'
    }
};

export default function PreferencesScreen({ navigation }) {
    const { preferences, updatePreference, userGender } = useContext(WardrobeContext);

    const renderLearnedProfile = () => {
        const profile = preferences.styleProfile;
        if (!profile) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Style Profile</Text>
                <View style={styles.profileDataContainer}>
                    <Text style={styles.profileText}><Text style={styles.bold}>Fit Style:</Text> {DIMENSION_LABELS.fitCombination[profile.fitCombination] || profile.fitCombination}</Text>
                    <Text style={styles.profileText}><Text style={styles.bold}>Colours:</Text> {DIMENSION_LABELS.colourPalette[profile.colourPalette] || profile.colourPalette}</Text>
                    <Text style={styles.profileText}><Text style={styles.bold}>Proportions:</Text> {DIMENSION_LABELS.proportionPreference[profile.proportionPreference] || profile.proportionPreference}</Text>
                    <Text style={styles.profileText}><Text style={styles.bold}>Formality:</Text> {DIMENSION_LABELS.formalityZone[profile.formalityZone] || profile.formalityZone}</Text>
                    <Text style={styles.profileText}><Text style={styles.bold}>Layering:</Text> {DIMENSION_LABELS.layeringTendency[profile.layeringTendency] || profile.layeringTendency}</Text>
                    <Text style={styles.profileText}><Text style={styles.bold}>Outfit Type:</Text> {DIMENSION_LABELS.outfitType[profile.outfitType] || profile.outfitType}</Text>
                </View>
                
                <Text style={styles.noteText}>These preferences were learned from your Style Quiz. You can adjust the toggles below to override them.</Text>
                
                <TouchableOpacity 
                    style={styles.retakeButton} 
                    onPress={() => navigation.navigate('StyleProfile', { gender: userGender || 'Female' })}
                >
                    <Text style={styles.retakeButtonText}>Retake Style Quiz</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderToggle = (key, label, description) => (
        <View style={styles.toggleRow}>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <Switch
                trackColor={{ false: '#e0e0e0', true: '#1a1a1a' }}
                thumbColor={'#fff'}
                ios_backgroundColor="#e0e0e0"
                onValueChange={(val) => updatePreference(key, val)}
                value={preferences[key]}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Outfitting Engine</Text>
                <Text style={styles.subtitle}>Customise how the AI scores and generates your outfits.</Text>

                {renderLearnedProfile()}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Colour Style</Text>
                    {renderToggle('preferColourful', 'Prefer Colourful', 'Focus on vibrant outfits with 3+ non-neutral colours')}
                    {renderToggle('preferMonochrome', 'Prefer Monochrome', 'Focus on all-neutral and monochromatic outfits')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fit Style</Text>
                    {renderToggle('preferBaggyFit', 'Prefer Baggy Fit', 'Boost matching oversized silhouettes')}
                    {renderToggle('preferFittedLook', 'Prefer Fitted Look', 'Boost tight and regular silhouettes')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Outfit Type</Text>
                    {renderToggle('preferDresses', 'Prefer Full Body', 'Generate more outfits using dresses and jumpsuits')}
                    {renderToggle('preferLayering', 'Prefer Layering', 'Aggressively add outerwear in mild 10-18°C weather')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Formality Bias</Text>
                    {renderToggle('preferCasualStyle', 'Prefer Casual', 'Relax penalties for mixing Casual and Everyday items')}
                    {renderToggle('preferSmartStyle', 'Prefer Smart', 'Relax penalties for mixing Smart and Everyday items')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weather</Text>
                    {renderToggle('rainReminder', 'Rain Reminders', 'Show umbrella alerts on your home screen during bad weather')}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18,
    },
    profileDataContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    profileText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    bold: {
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    noteText: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        lineHeight: 18,
        marginBottom: 16,
    },
    retakeButton: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    retakeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
