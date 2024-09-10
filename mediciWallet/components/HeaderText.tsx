import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const HeaderText = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Medici <Text style={styles.highlightedText}>Wallet</Text></Text>
      <Text style={styles.highlightedSubText}>America's no 1 <Text style={styles.subText}>Crypto App</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    padding: 10,
  },
  mainText: {
    fontSize: 40, 
    lineHeight: 45,
    color: '#d3dbe9',
    textAlign: 'left',
  },
  subText: {
    fontSize: 15,
    lineHeight: 30,
    color: '#d3dbe9',
    textAlign: 'left',
  },
  highlightedText: {
    color: '#21cf99',
  },
  highlightedSubText: {
    color: '#21cf99',
    fontSize: 15, 
    lineHeight: 30,
    textAlign: 'left',
  },
});

export default HeaderText;
