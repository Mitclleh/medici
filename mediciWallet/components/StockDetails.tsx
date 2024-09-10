import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stock } from "@/dataTypes/Stock"; 

interface StockDetailsProps {
  stock: Stock;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  return (
    <View style={styles.container}>
         <Text style={styles.header}>{stock.companyName}</Text>
      <View style={styles.detailSection}>
        <Text style={styles.boldText}>CEO</Text>
        <Text style={styles.text}>{stock.ceo}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.boldText}>Exchange</Text>
        <Text style={styles.text}>{stock.exchange}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.boldText}>Sector</Text>
        <Text style={styles.text}>{stock.sector}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.boldText}>Industry</Text>
        <Text style={styles.text}>{stock.industry}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.boldText}>Location</Text>
        <Text style={styles.text}>{stock.city}, {stock.state}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.boldText}>IPO</Text>
        <Text style={styles.text}>{stock.ipoDate}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={[styles.boldText, styles.descriptionTitle]}>Description</Text>
        <Text style={styles.text}>{stock.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
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
  detailSection: {
    marginBottom: 10
  },
  boldText: {
    fontWeight: "bold",
    color: 'white'
  },
  text: {
    color: 'white'
  },
  descriptionTitle: {
    marginTop: 5
  }
});

export default StockDetails;
