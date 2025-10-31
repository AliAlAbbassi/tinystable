import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Copy, Eye, EyeOff } from 'lucide-react-native';

interface PrivateKeyProps {
  privateKey: string | null;
  showPrivateKey: boolean;
  onCopy: () => void;
  onToggle: () => void;
}

export function PrivateKey({ privateKey, showPrivateKey, onCopy, onToggle }: PrivateKeyProps) {
  return (
    <View style={styles.card}>
      <View style={styles.labelContainer}>
        <Text style={styles.cardLabel}>Private Key</Text>
      </View>

      <View style={styles.keyHeader}>
        <View style={styles.keyTextContainer}>
          <Text style={styles.keyText}>
            {showPrivateKey && privateKey ? privateKey : '••••••••••••••••'}
          </Text>
        </View>

        <View style={styles.keyActions}>
          {showPrivateKey && privateKey && (
            <TouchableOpacity style={styles.iconButton} onPress={onCopy}>
              <Copy size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconButton} onPress={onToggle}>
            {showPrivateKey ? (
              <EyeOff size={16} color="#9ca3af" />
            ) : (
              <Eye size={16} color="#9ca3af" />
            )}
          </TouchableOpacity>
        </View>
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
  keyActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  keyText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
