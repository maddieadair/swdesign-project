export function getPrice(location, gallons, history) {
  const currentPrice = 1.5;
  let locFactor,
    HisFactor,
    galRequest = 0;
  locFactor = location === "Texas" ? 0.02 : 0.04;
  HisFactor = history > 0 ? 0.01 : 0;
  galRequest = gallons > 1000 ? 0.02 : 0.03;

  const margin = (locFactor - HisFactor + galRequest + 0.1) * currentPrice;
  const suggPrice = 1.5 + margin;
  const total = suggPrice * gallons;

  return suggPrice;
}

export function getTotal(gallons, price) {
  const total = gallons * price;
  return total;
}
