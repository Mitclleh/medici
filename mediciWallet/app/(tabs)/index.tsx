import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { apiService } from '@/services/apiService/apiService'; 
import { StockCard } from '@/components/StockCard';
import { Stock } from '@/services/apiService/responseTypes';




export default function HomeScreen() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stockData = await apiService.getStockData();
        setStocks(stockData);
      } catch (error) {
        setError('Failed to fetch stocks');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading stocks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 25, alignItems: 'center' }}>
      <View style={{ paddingTop: 5, paddingBottom: 15, alignItems: 'center' }}>
        <Text
          variant="titleLarge"
          style={{ fontWeight: 'bold', marginLeft: 5, marginBottom: 5, paddingBottom: 1 }}
        >
          Available Coins
        </Text>
      </View>
      
      <FlatList
        keyExtractor={(item) => item.ticker}
        data={stocks}
        renderItem={({ item }) => (
          <StockCard
            companyName={item.companyName}
            image={item.image}
            price={item.price}
            priceChange={item.priceChange}
            priceChangePercentage={item.priceChangePercentage}
            ticker={item.ticker}
          />
        )}
      />
    </View>
  );
}
