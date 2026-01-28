
export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number; // in Crores
  debtToEquity: number;
  roe: number; // Average 3 years percentage
  oneYearReturn: number; // Percentage
  sector: string;
  lastUpdated: string;
}

export interface ScreeningCriteria {
  minMarketCap: number;
  maxMarketCap: number;
  maxDebtToEquity: number;
  minRoe: number;
  maxOneYearReturn: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
