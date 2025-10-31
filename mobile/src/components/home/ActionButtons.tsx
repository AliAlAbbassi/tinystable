import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActionButtonsProps {
  isDepositing: boolean;
  isWithdrawing: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function ActionButtons({ isDepositing, isWithdrawing, onDeposit, onWithdraw }: ActionButtonsProps) {
  return (
    <View style={styles.actionsRow}>
      <TouchableOpacity
        style={[styles.primaryButton, isDepositing && styles.buttonDisabled]}
        onPress={onDeposit}
        disabled={isDepositing || isWithdrawing}
      >
        <Text style={styles.primaryButtonText}>
          {isDepositing ? 'Depositing...' : 'Deposit ETH'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.secondaryButton, isWithdrawing && styles.buttonDisabled]}
        onPress={onWithdraw}
        disabled={isDepositing || isWithdrawing}
      >
        <Text style={styles.secondaryButtonText}>
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
