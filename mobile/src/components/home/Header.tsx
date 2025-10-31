import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>tinystable</Text>
      <Text style={styles.subtitle}>Earn stable yields on ETH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 4,
  },
});
