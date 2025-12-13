// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OrderBookScreen from './src/screens/orderBookScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <OrderBookScreen />
    </SafeAreaProvider>
  );
}
