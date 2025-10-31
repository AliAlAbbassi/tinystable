import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Copy } from 'lucide-react-native';

interface WalletAddressProps {
  address: string | null;
  onCopy: () => void;
}

export function WalletAddress({ address, onCopy }: WalletAddressProps) {
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.labelContainer}>
        <Text style={styles.cardLabel}>Your Address</Text>
      </View>

      <View style={styles.keyHeader}>
        <Text style={styles.addressText}>
          {address ? formatAddress(address) : 'No wallet generated'}
        </Text>
        <TouchableOpacity style={styles.iconButton} onPress={onCopy}>
          <Copy size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>
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
    position: 'relative',
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  labelContainer: {
    height: 32,
    justifyContent: 'center',
  },
  addressText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
  },
  keyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    position: 'relative',
  },
});
