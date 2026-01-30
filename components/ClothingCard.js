import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ClothingCard({ name, image }) {
    return (
        <View style={styles.card}>
            <Image source={image} style={styles.image} />
            <Text style={styles.text}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { width: 100, alignItems: 'center', margin: 10 },
    image: { width: 80, height: 80, borderRadius: 8 },
    text: { marginTop: 5, textAlign: 'center' },
});