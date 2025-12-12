import { useEffect, useRef, useState } from 'react';

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

  const prevMapRef = useRef({
    _previous: {},
    _current: {},
  });

  useEffect(() => {
    mountedRef.current = true;

    function connect() {
      setStatus('connecting');
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
          try { ws.send(JSON.stringify(sub)); } catch (e) {}
        };

        ws.onmessage = (ev) => {
          if (!mountedRef.current) return;
          let msg;
          try { msg = JSON.parse(ev.data); } catch (e) { return; }

          if (msg && msg.type === 'l2_orderbook') {
            const buy = Array.isArray(msg.buy)
              ? msg.buy.map(i => ({ price: String(i.limit_price), size: Number(i.size) }))
              : [];
            const sell = Array.isArray(msg.sell)
              ? msg.sell.map(i => ({ price: String(i.limit_price), size: Number(i.size) }))
              : [];

            const newMap = {};
            buy.forEach(i => { newMap[i.price] = i.size; });
            sell.forEach(i => { newMap[i.price] = i.size; });

            prevMapRef.current._previous = prevMapRef.current._current || {};
            prevMapRef.current._current = newMap;

            const sortedAsks = sell.slice().sort((a, b) => Number(a.price) - Number(b.price));
            const sortedBids = buy.slice().sort((a, b) => Number(b.price) - Number(a.price));

            setAsks(sortedAsks);
            setBids(sortedBids);
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
          } else {
            // stop trying after max attempts
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
            payload: { channels: [{ name: 'l2_orderbook', symbols: [symbol] }] }
          };
          ws.send(JSON.stringify(unsub));
        } catch (e) { }
      }
      try { ws && ws.close(); } catch (e) { }
    };
  }, [symbol]);

  return { asks, bids, prevMapRef, wsRef, status };
}
