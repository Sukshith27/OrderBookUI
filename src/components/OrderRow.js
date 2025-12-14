import React, { useEffect, useMemo, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

function OrderCell({ value, align = 'right', color, prev, curr, enableFlash = false }) {
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
      <Text style={[styles.text, { textAlign: align, color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default React.memo(OrderCell);

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  text: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  up: { backgroundColor: '#dff7df' },
  down: { backgroundColor: '#f7dfdf' },
});
