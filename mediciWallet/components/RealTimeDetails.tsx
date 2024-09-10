import React, { useEffect, useState } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import WebSocketService from '../services/webSocketService/WebSocketService'; 

interface WebSocketResponse {
  e: string;
  s: string;
  p: number;
  q: number;
  t: number;
}

const RealtimeDetails: React.FC<{ ticker: string }> = ({ ticker }) => {
  const [data, setData] = useState<WebSocketResponse | null>(null);
  
  useEffect(() => {
    const wsService = new WebSocketService();
    wsService.subscribe(ticker);

    const handleNewData = (newData: WebSocketResponse) => {
      setData(newData);
    };

    wsService.on('message', handleNewData);

    return () => {
      wsService.off('message', handleNewData);
      wsService.disconnect();
    };
  }, [ticker]);

  return (
    <View style={styles.container} >
      <Text style={styles.header}>Live Data for {ticker}</Text>
      {data ? (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Price:</Text>
            <Text style={styles.tableCell}>{data.p}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Quantity:</Text>
            <Text style={styles.tableCell}>{data.q}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Timestamp:</Text>
            <Text style={styles.tableCell}>{new Date(data.t).toLocaleTimeString()}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
    backgroundColor: '#333',
    borderRadius: 8
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    backgroundColor: '#355E3B', 
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },

  table: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#333',
  
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tableCell: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RealtimeDetails;
