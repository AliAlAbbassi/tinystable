import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useWalletStore } from '../store/walletStore';
import { generateWallet, importWallet } from '../services/walletService';
import { WalletAddress } from '../components/wallet/WalletAddress';
import { PrivateKey } from '../components/wallet/PrivateKey';
import { SecurityWarning } from '../components/wallet/SecurityWarning';
import { WalletActions } from '../components/wallet/WalletActions';
import { ImportWalletModal } from '../components/wallet/ImportWalletModal';

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
  const { address, privateKey, showPrivateKey, togglePrivateKey, setWallet, loadWallet } = useWalletStore();
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
    showAlert(
      'Generate New Wallet?',
      'This will create a new wallet and replace your current one. Make sure you have backed up your current private key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          style: 'destructive',
          onPress: () => {
            try {
              const wallet = generateWallet();
              setWallet(wallet.address, wallet.privateKey);
              showAlert('Success!', `New wallet generated!`);
            } catch (error) {
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

  const handleImportWallet = (pk: string) => {
    if (!pk || pk.trim() === '') {
      showAlert('Error', 'Please enter a private key');
      return;
    }

    setIsImporting(true);
    try {
      const wallet = importWallet(pk.trim());
      setWallet(wallet.address, wallet.privateKey);
      setShowImportModal(false);
    } catch (error) {
      showAlert('Error', 'Invalid private key format. Please check your private key and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>wallet</Text>
          <Text style={styles.subtitle}>Manage your self-custody wallet</Text>
        </View>

        <WalletAddress address={address} onCopy={handleCopyAddress} />
        <PrivateKey privateKey={privateKey} showPrivateKey={showPrivateKey} onCopy={handleCopyPrivateKey} onToggle={togglePrivateKey} />
        <SecurityWarning />
        <WalletActions onGenerate={handleGenerateWallet} onExport={handleExportWallet} onImport={() => setShowImportModal(true)} />

      </ScrollView>

      <ImportWalletModal visible={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImportWallet} isImporting={isImporting} />
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
});
