import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProtocolStatsProps {
  tvl: string;
  userCount: string;
}

export function ProtocolStats({ tvl, userCount }: ProtocolStatsProps) {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Protocol Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TVL</Text>
          <Text style={styles.statValue}>{tvl}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Aave TVL</Text>
          <Text style={styles.statValue}>{userCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginRight: 8,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontWeight: '600',
  },
});
