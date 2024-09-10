
export interface Stock {
    ticker: string;
    companyName: string;
    image: string;
    price: number;
    priceChange: number;
    priceChangePercentage: number;
    ceo: string;
    exchange: string;
    sector: string;
    industry: string;
    city: string;
    state: string;
    ipoDate: string;
    description: string;
  }

  export interface StockPrice {
    date: string;
    value: number;
  }
  