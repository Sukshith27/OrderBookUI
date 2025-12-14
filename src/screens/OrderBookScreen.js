import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import OrderCell from '../components/orderRow';
import useOrderBook from '../hooks/useOrderBook';


export default function OrderBookScreen() {
  const startRenderTime = useRef(Date.now());
  const firstRenderDone = useRef(false);

  const { asks, bids, prevMapRef, getPrevSize } = useOrderBook('BTCUSD');

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

    // retun only 1st item
    // return out.slice(0, 2);
    return out;
  }, [safeAsks, safeBids]);

  const renderItem = ({ item }) => {
    if (!firstRenderDone.current) {
      const now = Date.now();
      const listRenderTime = now - startRenderTime.current;
      console.log(`[perf] list first item render time: ${listRenderTime} ms`);
      console.log('[perf] ws time - render time:', listRenderTime - (globalThis.WebSocketFirstMessageTime), 'ms');

      firstRenderDone.current = true;
    }

    return (
      <View style={styles.row}>
        <OrderCell
          value={item.ask.price}
          color="#b00020"
        />
        <OrderCell
          value={item.ask.size}
          curr={item.ask.size}
          prev={getPrevSize(item.ask.price)}
          enableFlash
        />
        <OrderCell
          value={item.bid.size}
          curr={item.bid.size}
          prev={getPrevSize(item.bid.price)}
          enableFlash
        />
        <OrderCell
          value={item.bid.price}
          color="#006400"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Book — BTCUSD</Text>
        <Text style={styles.subtitle}>L2 Orderbook (live via WebSocket)</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colHeader}>Price (USD)</Text>
        <Text style={styles.colHeader}>Size (BTC)</Text>
        <Text style={styles.colHeader}>Size (BTC)</Text>
        <Text style={styles.colHeader}>Price (USD)</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(i) => i.key}
        renderItem={renderItem}
        initialNumToRender={12}
        maxToRenderPerBatch={20}
        // windowSize={5}
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
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },

  side: { flex: 1 },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  colHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

});
