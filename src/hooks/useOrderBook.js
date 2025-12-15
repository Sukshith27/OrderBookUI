import { useEffect, useRef, useState } from 'react';
import { toEntry, buildSizeMap, sortAsks, sortBids } from '../utils/orderBook';

const WS_URL = 'wss://socket.india.deltaex.org';
const MAX_RECONNECT = 5;

export default function useOrderBook(symbol = 'BTCUSD', isScrollingRef) {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [status, setStatus] = useState('connecting');

  const wsRef = useRef(null);
  const mountedRef = useRef(true);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);
  const rafRef = useRef(null);

  const prevMapRef = useRef({
    _previous: {},
    _current: {},
    _pending: null,
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
          ws.send(JSON.stringify({
            type: 'subscribe',
            payload: { channels: [{ name: 'l2_orderbook', symbols: [symbol] }] },
          }));
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;

          let msg;
          try { msg = JSON.parse(event.data); } catch { return; }
          if (msg.type !== 'l2_orderbook') return;

          const buy = toEntry(msg.buy);
          const sell = toEntry(msg.sell);

          if (isScrollingRef?.current) {
            prevMapRef.current._pending = { buy, sell };
            return;
          }

          applySnapshot(buy, sell);
        };

        ws.onerror = () => setStatus('error');

        ws.onclose = () => {
          setStatus('closed');
          if (!mountedRef.current) return;
          if (reconnectAttempts.current < MAX_RECONNECT) {
            const delay = 500 * Math.pow(2, reconnectAttempts.current++);
            reconnectTimer.current = setTimeout(connect, delay);
          }
        };
      } catch {
        setStatus('error');
      }
    }

    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { wsRef.current?.close(); } catch {}
    };
  }, [symbol]);

  function applySnapshot(buy, sell) {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const newMap = buildSizeMap(buy, sell);
      prevMapRef.current._previous = prevMapRef.current._current || {};
      prevMapRef.current._current = newMap;

      setAsks(sortAsks(sell));
      setBids(sortBids(buy));

      rafRef.current = null;
    });
  }

  function flushPending() {
    const pending = prevMapRef.current._pending;
    if (!pending) return;
    applySnapshot(pending.buy, pending.sell);
    prevMapRef.current._pending = null;
  }

  function getPrevSize(price) {
    return prevMapRef.current._previous[String(price)];
  }

  return { asks, bids, status, getPrevSize, flushPending };
}
