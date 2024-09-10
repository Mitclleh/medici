import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000'; 

export const apiService = {
  async getStockData() {
    try {
      const response = await axios.get(`${BASE_URL}/stocks`, { timeout: 5000 });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  },

  async getStockPrices(ticker: string) {
    try {
      const response = await axios.get(`${BASE_URL}/stockPrices`);
      const data = response.data;
      const pricesData = data.find((sp: { ticker: string }) => sp.ticker === ticker);
      return pricesData ? pricesData.prices : [];
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      throw error;
    }
  },

  async getStockDetails(ticker: string) {
    try {
      const response = await axios.get(`${BASE_URL}/stocks`);
      const data = response.data;
      return data.find((s: { ticker: string }) => s.ticker === ticker);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      throw error;
    }
  },
};
