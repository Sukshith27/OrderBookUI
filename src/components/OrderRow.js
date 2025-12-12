import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function OrderRowInner({ price = '', size = '', side = 'ask', prevMap }) {
  const key = String(price);
  const currSize = typeof size === 'number' ? size : (Number(size) || 0);

  const prevSize = useMemo(() => {
    try {
      return prevMap && prevMap.current && prevMap.current._previous
        ? (prevMap.current._previous[key] ?? undefined)
        : undefined;
    } catch (e) {
      return undefined;
    }
  }, [key, prevMap]);

  const [flash, setFlash] = useState(null); 

  useEffect(() => {
    if (prevSize === undefined) return; 
    if (currSize > prevSize) {
      setFlash('up');
      const t = setTimeout(() => setFlash(null), 250);
      return () => clearTimeout(t);
    } else if (currSize < prevSize) {
      setFlash('down');
      const t = setTimeout(() => setFlash(null), 250);
      return () => clearTimeout(t);
    }
    
  }, [currSize, prevSize]);

  const containerStyle = useMemo(() => {
    if (flash === 'up') return [styles.container, styles.flashUp];
    if (flash === 'down') return [styles.container, styles.flashDown];
    return [styles.container];
  }, [flash]);

  return (
    <View style={containerStyle}>
     <Text
        style={[
          styles.price,
          side === 'ask' ? styles.askText : styles.bidText,
          styles.leftCol,
        ]}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        {price}
      </Text>

      <Text
        style={[styles.size, styles.rightCol]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {String(size)}
      </Text>
    </View>
  );
}

const OrderRow = React.memo(OrderRowInner);

export default OrderRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
 leftCol: {
    flex: 1,
    textAlign: 'left',
    paddingRight: 6,
  },
  rightCol: {
    flex: 1,
    textAlign: 'right',
    paddingLeft: 6,
  },

  price: {
    fontWeight: '600',
    includeFontPadding: false,
  },
  size: {
    color: '#333',
    includeFontPadding: false,
  },

  askText: {
    color: '#b00020',
  },
  bidText: {
    color: '#006400',
  },

  flashUp: {
    backgroundColor: '#e8f8ee', 
  },
  flashDown: {
    backgroundColor: '#fdecec',
  },
});
