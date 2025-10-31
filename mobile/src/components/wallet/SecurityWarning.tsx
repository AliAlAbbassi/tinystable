import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SecurityWarning() {
  return (
    <View style={styles.warningCard}>
      <Text style={styles.warningTitle}>
        Security Warning
      </Text>
      <Text style={styles.warningText}>
        Never share your private key. Anyone with access to it can steal your funds.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  warningCard: {
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(153, 27, 27, 0.3)',
  },
  warningTitle: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    color: 'rgba(245, 158, 11, 0.8)',
    fontSize: 12,
  },
});
