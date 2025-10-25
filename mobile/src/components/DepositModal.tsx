import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
}

export function DepositModal({ visible, onClose, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = React.useState('');

  const handleDeposit = () => {
    if (amount && parseFloat(amount) > 0) {
      onDeposit(amount);
      setAmount('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Deposit ETH</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Amount to Deposit</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.inputCurrency}>ETH</Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>You will receive:</Text>
            <Text style={styles.infoValue}>
              {amount ? `${amount} tvETH` : '0.00 tvETH'}
            </Text>
            <Text style={styles.infoSubtext}>
              Current APY: 4.2% • Powered by Aave V3
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeposit}
              style={[
                styles.depositButton,
                (!amount || parseFloat(amount) <= 0) && styles.depositButtonDisabled
              ]}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Text style={styles.depositButtonText}>
                Deposit {amount ? amount : '0.00'} ETH
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  input: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputCurrency: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8,
  },
  infoValue: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 8,
  },
  depositButtonDisabled: {
    opacity: 0.5,
  },
  depositButtonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});