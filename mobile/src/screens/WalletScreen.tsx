import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Eye, EyeOff } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useWalletStore } from '../store/walletStore';
import { generateWallet, importWallet, formatAddress as formatAddr, formatPrivateKey as formatPrivKey } from '../services/walletService';

// Cross-platform alert function
const showAlert = (title: string, message: string, buttons?: any[]) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const result = window.confirm(`${title}\n\n${message}`);
      if (result && buttons[1]?.onPress) {
        buttons[1].onPress();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

export function WalletScreen() {
  const { address, privateKey, showPrivateKey, togglePrivateKey, setWallet, clearWallet, loadWallet } = useWalletStore();

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleCopyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      showAlert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const handleCopyPrivateKey = async () => {
    if (privateKey) {
      await Clipboard.setStringAsync(privateKey);
      showAlert('Copied!', 'Private key copied to clipboard');
    }
  };

  const handleGenerateWallet = () => {
    console.log('Generate wallet button pressed');
    showAlert(
      'Generate New Wallet?',
      'This will create a new wallet and replace your current one. Make sure you have backed up your current private key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          style: 'destructive',
          onPress: () => {
            console.log('Generating new wallet...');
            try {
              const wallet = generateWallet();
              console.log('Wallet generated:', wallet.address);
              setWallet(wallet.address, wallet.privateKey);
              showAlert('Success!', `New wallet generated!\n\nAddress: ${formatAddress(wallet.address)}`);
            } catch (error) {
              console.error('Error generating wallet:', error);
              showAlert('Error', 'Failed to generate wallet');
            }
          }
        }
      ]
    );
  };

  const handleExportWallet = () => {
    if (!privateKey) {
      showAlert('No Wallet', 'Please generate a wallet first');
      return;
    }

    showAlert(
      'Export Wallet',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy Private Key',
          onPress: async () => {
            await Clipboard.setStringAsync(privateKey);
            showAlert('Copied!', 'Private key copied to clipboard');
          }
        },
        {
          text: 'Share QR Code',
          onPress: () => showAlert('QR Code', 'QR code sharing not implemented yet')
        }
      ]
    );
  };

  const handleImportWallet = () => {
    showAlert(
      'Import Wallet',
      'Choose import method:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Paste Private Key',
          onPress: () => handleImportFromPrivateKey()
        },
        {
          text: 'Scan QR Code',
          onPress: () => showAlert('Import', 'QR code scanning not implemented yet')
        }
      ]
    );
  };

  const handleImportFromPrivateKey = async () => {
    try {
      const privateKey = await Clipboard.getStringAsync();

      if (!privateKey || privateKey.trim() === '') {
        showAlert('Error', 'No private key found in clipboard. Please copy a valid private key first.');
        return;
      }

      showAlert(
        'Import Wallet',
        `Import wallet from private key?\n\nThis will replace your current wallet. Make sure you have backed up your current private key.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: () => {
              try {
                const wallet = importWallet(privateKey.trim());
                setWallet(wallet.address, wallet.privateKey);
                showAlert('Success!', `Wallet imported successfully!\n\nAddress: ${formatAddress(wallet.address)}`);
              } catch (error) {
                showAlert('Error', 'Invalid private key format. Please check your private key and try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      showAlert('Error', 'Failed to read clipboard. Please copy a valid private key first.');
    }
  };

  const formatAddress = (addr: string) => {
    return formatAddr(addr);
  };

  const formatPrivateKey = (key: string) => {
    return formatPrivKey(key);
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
          <View style={styles.labelContainer}>
            <Text style={styles.cardLabel}>Your Address</Text>
          </View>

          <View style={styles.keyHeader}>
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
                <TouchableOpacity style={styles.iconButton} onPress={handleCopyPrivateKey}>
                  <Copy size={16} color="#9ca3af" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.iconButton} onPress={togglePrivateKey}>
                {showPrivateKey ? (
                  <EyeOff size={16} color="#9ca3af" />
                ) : (
                  <Eye size={16} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>
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
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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