// src/screens/OrderBookScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrderBookScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Order Book</Text>
                <Text style={styles.subtitle}>L2 Orderbook (WebSocket)</Text>
            </View>

            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    order lists
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
    title: { fontSize: 18, fontWeight: '700' },
    subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    placeholderText: { color: '#666', textAlign: 'center' },
});
