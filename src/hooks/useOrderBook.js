import { useEffect, useRef, useState } from 'react';
import { toEntry, buildSizeMap, sortAsks, sortBids } from '../utils/orderBook';

const WS_URL = 'wss://socket.india.deltaex.org';
const MAX_RECONNECT = 5;

export default function useOrderBook(symbol = 'BTCUSD') {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [status, setStatus] = useState('connecting'); 

  const wsRef = useRef(null);
  const mountedRef = useRef(true);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);

  const isFirstMessageTimeLogged = useRef(false);

  const prevMapRef = useRef({
    _previous: {},
    _current: {},
  });

  useEffect(() => {
    mountedRef.current = true;

    function connect() {
      setStatus('connecting');
      const connectionStartTime = Date.now();

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          reconnectAttempts.current = 0;
          setStatus('open');

          const sub = {
            type: 'subscribe',
            payload: {
              channels: [{ name: 'l2_orderbook', symbols: [symbol] }],
            },
          };

          try {
            ws.send(JSON.stringify(sub));
          } catch (e) {}
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;

          if(!isFirstMessageTimeLogged.current) {
            const timeTaken = Date.now() - connectionStartTime
            console.log("[perf] First ws message received in:", timeTaken, "ms");
            globalThis.WebSocketFirstMessageTime = timeTaken;
            isFirstMessageTimeLogged.current = true;
          }
          

          let msg;
          try {
            msg = JSON.parse(event.data);
            console.log('Received message:', msg);
          } catch (e) {
            return;
          }

          if (msg && msg.type === 'l2_orderbook') {
            const buyEntries = toEntry(msg.buy);
            const sellEntries = toEntry(msg.sell);

            const newMap = buildSizeMap(buyEntries, sellEntries);

            prevMapRef.current._previous = prevMapRef.current._current || {};
            prevMapRef.current._current = newMap;

            setAsks(sortAsks(sellEntries));
            setBids(sortBids(buyEntries));
          }
        };

        ws.onerror = () => {
          setStatus('error');
        };

        ws.onclose = () => {
          setStatus('closed');

          if (!mountedRef.current) return;

          if (reconnectAttempts.current < MAX_RECONNECT) {
            const delay = 500 * Math.pow(2, reconnectAttempts.current); // 500ms, 1s, 2s, 4s...
            reconnectAttempts.current += 1;

            reconnectTimer.current = setTimeout(() => {
              connect();
            }, delay);
          }
        };
      } catch (err) {
        setStatus('error');
      }
    }

    connect();

    return () => {
      mountedRef.current = false;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }

      const ws = wsRef.current;

      if (ws && ws.readyState === 1) {
        try {
          const unsub = {
            type: 'unsubscribe',
            payload: {
              channels: [{ name: 'l2_orderbook', symbols: [symbol] }],
            },
          };
          ws.send(JSON.stringify(unsub));
        } catch (e) {}
      }

      try {
        ws && ws.close();
      } catch (e) {}
    };
  }, [symbol]);

  function getPrevSize(price) {
    try {
      const p = String(price);
      return prevMapRef.current._previous[p];
    } catch (e) {
      return undefined;
    }
  }

  return {
    asks,
    bids,
    prevMapRef,
    wsRef,
    status,
    getPrevSize,
  };
}
