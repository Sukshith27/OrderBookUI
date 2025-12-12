import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrderRow({ price = '', size = '', side = 'ask' }) {
  return (
    <View style={[styles.container, side === 'ask' ? styles.ask : styles.bid]}>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.size}>{String(size)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12 },
  ask: {},
  bid: {},
  price: { width: 50, fontWeight: '600' },
  size: { width: 50, textAlign: 'right', color: '#333' },
});
