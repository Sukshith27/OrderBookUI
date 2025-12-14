export function toEntry(arr = []) {
  return Array.isArray(arr)
    ? arr.map(i => ({ price: String(i.limit_price), size: Number(i.size) }))
    : [];
}

export function buildSizeMap(buy = [], sell = []) {
  const m = {};
  buy.forEach(i => { m[i.price] = i.size; });
  sell.forEach(i => { m[i.price] = i.size; });
  return m;
}

export function sortAsks(sell = []) {
  return sell.slice().sort((a, b) => Number(a.price) - Number(b.price));
}

export function sortBids(buy = []) {
  return buy.slice().sort((a, b) => Number(b.price) - Number(a.price));
}
