import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WalletActionsProps {
  onGenerate: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function WalletActions({ onGenerate, onExport, onImport }: WalletActionsProps) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.primaryButton} onPress={onGenerate}>
        <Text style={styles.primaryButtonText}>Generate New Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onExport}>
        <Text style={styles.secondaryButtonText}>Export Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onImport}>
        <Text style={styles.secondaryButtonText}>Import Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
