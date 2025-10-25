import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Eye, EyeOff } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useWalletStore } from '../store/walletStore';
import { WalletService } from '../services/walletService';

export function WalletScreen() {
  const { address, privateKey, showPrivateKey, togglePrivateKey, setWallet, clearWallet } = useWalletStore();

  const handleCopyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const handleGenerateWallet = () => {
    Alert.alert(
      'Generate New Wallet?',
      'This will create a new wallet and replace your current one. Make sure you have backed up your current private key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          style: 'destructive',
          onPress: () => {
            const wallet = WalletService.generateWallet();
            setWallet(wallet.address, wallet.privateKey);
            Alert.alert('Success!', `New wallet generated!\n\nAddress: ${WalletService.formatAddress(wallet.address)}`);
          }
        }
      ]
    );
  };

  const handleExportWallet = () => {
    if (!privateKey) {
      Alert.alert('No Wallet', 'Please generate a wallet first');
      return;
    }

    Alert.alert(
      'Export Wallet',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy Private Key',
          onPress: async () => {
            await Clipboard.setStringAsync(privateKey);
            Alert.alert('Copied!', 'Private key copied to clipboard');
          }
        },
        {
          text: 'Share QR Code',
          onPress: () => Alert.alert('QR Code', 'QR code sharing not implemented yet')
        }
      ]
    );
  };

  const handleImportWallet = () => {
    Alert.alert(
      'Import Wallet',
      'Choose import method:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Paste Private Key',
          onPress: () => Alert.alert('Import', 'Private key import not implemented yet')
        },
        {
          text: 'Scan QR Code',
          onPress: () => Alert.alert('Import', 'QR code scanning not implemented yet')
        }
      ]
    );
  };

  const formatAddress = (addr: string) => {
    return WalletService.formatAddress(addr);
  };

  const formatPrivateKey = (key: string) => {
    return WalletService.formatPrivateKey(key);
  };

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
              {address ? formatAddress(address) : 'No wallet generated'}
            </Text>
            <TouchableOpacity style={styles.iconButton} onPress={handleCopyAddress}>
              <Copy size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Private Key */}
        <View style={styles.card}>
          <View style={styles.keyHeader}>
            <Text style={styles.cardLabel}>Private Key</Text>
            <TouchableOpacity onPress={togglePrivateKey}>
              {showPrivateKey ? (
                <EyeOff size={16} color="#9ca3af" />
              ) : (
                <Eye size={16} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.keyText}>
            {showPrivateKey && privateKey ? formatPrivateKey(privateKey) : '••••••••••••••••'}
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
          <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateWallet}>
            <Text style={styles.primaryButtonText}>Generate New Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleExportWallet}>
            <Text style={styles.secondaryButtonText}>Export Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleImportWallet}>
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