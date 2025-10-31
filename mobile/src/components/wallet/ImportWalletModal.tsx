import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { X, Clipboard as ClipboardIcon } from 'lucide-react-native';

interface ImportWalletModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (privateKey: string) => void;
  isImporting: boolean;
}

export function ImportWalletModal({ visible, onClose, onImport, isImporting }: ImportWalletModalProps) {
  const [importPrivateKey, setImportPrivateKey] = React.useState('');

  const handleConfirmImport = () => {
    onImport(importPrivateKey);
    setImportPrivateKey('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import Wallet</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            Enter your private key to import an existing wallet. This will replace your current wallet.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={importPrivateKey}
              onChangeText={setImportPrivateKey}
              placeholder="Enter or paste private key (0x...)"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={async () => {
                const text = await navigator.clipboard.readText();
                setImportPrivateKey(text.trim());
              }}
            >
              <ClipboardIcon size={20} color="#fff" />
              <Text style={styles.pasteButtonText}>Paste</Text>
            </TouchableOpacity>
          </View>

          {importPrivateKey.length > 0 && (
            <Text style={styles.previewText}>
              Preview: {importPrivateKey.substring(0, 10)}...
            </Text>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !importPrivateKey && styles.disabledButton]}
              onPress={handleConfirmImport}
              disabled={!importPrivateKey || isImporting}
            >
              <Text style={styles.confirmButtonText}>
                {isImporting ? 'Importing...' : 'Import Wallet'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#3f3f46',
    minHeight: 100,
  },
  pasteButton: {
    backgroundColor: '#3f3f46',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasteButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  previewText: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
