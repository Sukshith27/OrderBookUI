import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import OrderCell from '../components/orderRow';
import useOrderBook from '../hooks/useOrderBook';

export default function OrderBookScreen() {
  const { asks, bids, getPrevSize } = useOrderBook('BTCUSD');

  const safeAsks = Array.isArray(asks) ? asks : [];
  const safeBids = Array.isArray(bids) ? bids : [];

  const rows = useMemo(() => {
    const maxLen = Math.max(safeAsks.length, safeBids.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        key: `${safeAsks[i]?.price || ''}-${safeBids[i]?.price || ''}-${i}`,
        ask: safeAsks[i] || { price: '', size: '' },
        bid: safeBids[i] || { price: '', size: '' },
      });
    }
    return out;
  }, [safeAsks, safeBids]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>

      <OrderCell value={item.ask.price} color="#ff6b6b" />
      <OrderCell
        value={item.ask.size}
        curr={item.ask.size}
        prev={getPrevSize(item.ask.price)}
        enableFlash
        color="#ffffff"
      />


      <OrderCell
        value={item.bid.size}
        curr={item.bid.size}
        prev={getPrevSize(item.bid.price)}
        enableFlash
        color="#ffffff"
      />
      <OrderCell value={item.bid.price} color="#4cd964" />
    </View>
  );

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
        windowSize={50}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        getItemLayout={(d, i) => ({ length: 44, offset: 44 * i, index: i })}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1217',
  },

  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1217',
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
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
