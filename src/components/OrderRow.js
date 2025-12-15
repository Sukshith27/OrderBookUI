import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

function OrderCell({ value, color = '#e6e6e6', prev, curr, enableFlash = false }) {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!enableFlash) return;
    if (prev === undefined || curr === undefined) return;

    if (curr > prev) {
      setFlash('up');
      const t = setTimeout(() => setFlash(null), 250);
      return () => clearTimeout(t);
    }
    if (curr < prev) {
      setFlash('down');
      const t = setTimeout(() => setFlash(null), 250);
      return () => clearTimeout(t);
    }
  }, [prev, curr, enableFlash]);

  return (
    <View style={[styles.cell, flash === 'up' && styles.up, flash === 'down' && styles.down]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default React.memo(OrderCell);

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  up: {
    backgroundColor: 'rgba(76,217,100,0.15)',
  },
  down: {
    backgroundColor: 'rgba(255,107,107,0.15)',
  },
});
