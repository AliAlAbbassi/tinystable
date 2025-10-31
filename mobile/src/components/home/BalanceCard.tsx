import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BalanceCardProps {
  balance: string;
  ethPrice: number;
}

export function BalanceCard({ balance, ethPrice }: BalanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Your Balance</Text>
      <Text style={styles.balanceText}>{balance} ETH</Text>
      <Text style={styles.cardSubtext}>
        ≈ ${ethPrice > 0 ? (parseFloat(balance) * ethPrice).toFixed(2) : '0.00'} USD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
});
