import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Eye, EyeOff } from 'lucide-react-native';

export function WalletScreen() {
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>wallet</Text>
          <Text style={styles.subtitle}>Manage your self-custody wallet</Text>
        </View>

        {/* Wallet Address */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Address</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>
              0x742d...b79b
            </Text>
            <TouchableOpacity style={styles.iconButton}>
              <Copy size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Private Key */}
        <View style={styles.card}>
          <View style={styles.keyHeader}>
            <Text style={styles.cardLabel}>Private Key</Text>
            <TouchableOpacity onPress={() => setShowPrivateKey(!showPrivateKey)}>
              {showPrivateKey ? (
                <EyeOff size={16} color="#9ca3af" />
              ) : (
                <Eye size={16} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.keyText}>
            {showPrivateKey ? '0xac097...2ff80' : '••••••••••••••••'}
          </Text>
        </View>

        {/* Security Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>
            Security Warning
          </Text>
          <Text style={styles.warningText}>
            Never share your private key. Anyone with access to it can steal your funds.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Generate New Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Export Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Import Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
    flex: 1,
  },
  iconButton: {
    marginLeft: 8,
    padding: 8,
  },
  keyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  keyText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
  },
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