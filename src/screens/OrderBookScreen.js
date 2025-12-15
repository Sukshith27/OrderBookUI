import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import OrderCell from '../components/orderRow';
import useOrderBook from '../hooks/useOrderBook';

const EMPTY = { price: '', size: '' };
const FLASH_LEVELS = 15;

export default function OrderBookScreen() {
  const isScrollingRef = useRef(false);
  const { asks, bids, getPrevSize, flushPending } =
    useOrderBook('BTCUSD', isScrollingRef);

  const rows = useMemo(() => {
    const maxLen = Math.max(asks.length, bids.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        key: `${asks[i]?.price || ''}-${bids[i]?.price || ''}-${i}`,
        ask: asks[i] || EMPTY,
        bid: bids[i] || EMPTY,
        index: i,
      });
    }
    return out;
  }, [asks, bids]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.row}>
      <OrderCell value={item.ask.price} color="#ff6b6b" />
      <OrderCell
        value={item.ask.size}
        curr={item.ask.size}
        prev={getPrevSize(item.ask.price)}
        enableFlash={item.index < FLASH_LEVELS}
      />
      <OrderCell
        value={item.bid.size}
        curr={item.bid.size}
        prev={getPrevSize(item.bid.price)}
        enableFlash={item.index < FLASH_LEVELS}
      />
      <OrderCell value={item.bid.price} color="#4cd964" />
    </View>
  ), [getPrevSize]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Book</Text>
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
        windowSize={8}
        initialNumToRender={12}
        maxToRenderPerBatch={20}
        removeClippedSubviews
        getItemLayout={(d, i) => ({ length: 44, offset: 44 * i, index: i })}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => { isScrollingRef.current = true; }}
        onScrollEndDrag={() => {
          isScrollingRef.current = false;
          flushPending();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12161c' },

  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  colHeader: {
    flex: 1,
    fontSize: 12,
    color: '#8b8f97',
    textAlign: 'right',
    paddingHorizontal: 6,
  },

  row: {
    flexDirection: 'row',
    height: 44,
  },

  listContent: {
    paddingBottom: 32,
  },
});
