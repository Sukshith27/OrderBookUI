import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import OrderRow from '../components/OrderRow';
import useOrderBook from '../hooks/useOrderBook';


export default function OrderBookScreen() {
  const { asks, bids, prevMapRef } = useOrderBook('BTCUSD');

  const safeAsks = Array.isArray(asks) ? asks : [];
  const safeBids = Array.isArray(bids) ? bids : [];

  const rows = useMemo(() => {
    const maxLen = Math.max(safeAsks.length, safeBids.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        key: String(i),
        ask: safeAsks[i] || { price: '', size: '' },
        bid: safeBids[i] || { price: '', size: '' },
      });
    }
    return out;
  }, [safeAsks, safeBids]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Book — BTCUSD</Text>
        <Text style={styles.subtitle}>L2 Orderbook (live via WebSocket)</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.colHeader, styles.left]}>Ask Price</Text>
        <Text style={[styles.colHeader, styles.right]}>Bid Price</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.side}>
              <OrderRow price={item.ask.price} size={item.ask.size} side="ask" prevMap={prevMapRef} />
            </View>
            <View style={styles.side}>
              <OrderRow price={item.bid.price} size={item.bid.size} side="bid" prevMap={prevMapRef} />
            </View>
          </View>
        )}
        initialNumToRender={12}
        maxToRenderPerBatch={18}
        windowSize={21}
        getItemLayout={(data, index) => ({ length: 48, offset: 48 * index, index })}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  colHeader: { fontSize: 12, fontWeight: '600' },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },

  listContent: { paddingBottom: 24 },
row: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f6f6f6',
  },
  side: { flex: 1 },
});
