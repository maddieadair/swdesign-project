export function getPrice(location, gallons, history) {
    console.log("location", location);
    console.log("gallons", gallons);
    console.log("history", history);
    const currentPrice = 1.5;
    let locFactor,
      HisFactor,
      galRequest = 0;
    locFactor = location === "TX" ? 0.02 : 0.04;
    HisFactor = history > 0 ? 0.01 : 0;
    galRequest = gallons > 1000 ? 0.02 : 0.03;
  
    const margin = (locFactor - HisFactor + galRequest + 0.1) * currentPrice;
    const suggPrice = 1.5 + margin;
    const total = suggPrice * gallons;

    console.log("locfactor", locFactor)
    console.log("hisfactor", HisFactor)
    console.log("galrequest", galRequest)

    console.log("margin", margin)
    console.log("suggprice", suggPrice)
    console.log("total", total)
  
    return suggPrice;
  }
  
  export function getTotal(gallons, price) {
    console.log("GALLONS", gallons);
    console.log("PRICE", price)
    const total = gallons * price;
    return total;
  }
