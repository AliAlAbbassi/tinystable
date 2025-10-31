import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  onWithdraw: (amount: string) => void;
  maxAmount?: string;
  rawMaxAmount?: string;
}

export function WithdrawModal({ visible, onClose, onWithdraw, maxAmount = "0.00", rawMaxAmount = "0" }: WithdrawModalProps) {
  const [amount, setAmount] = React.useState('');

  const handleWithdraw = () => {
    if (amount && parseFloat(amount) > 0) {
      onWithdraw(amount);
      setAmount('');
      onClose();
    }
  };

  const handleMaxPress = () => {
    setAmount(rawMaxAmount);
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
            <Text style={styles.title}>Withdraw tvETH</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available to withdraw</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceValue}>{maxAmount} tvETH</Text>
              <TouchableOpacity onPress={handleMaxPress} style={styles.maxButton}>
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Amount to Withdraw</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.inputCurrency}>tvETH</Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>You will receive approximately:</Text>
            <Text style={styles.infoValue}>
              {amount ? `~${amount} ETH` : '0.00 ETH'}
            </Text>
            <Text style={styles.infoSubtext}>
              The final amount may vary slightly due to the exchange rate.
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
              onPress={handleWithdraw}
              style={[
                styles.withdrawButton,
                (!amount || parseFloat(amount) <= 0) && styles.withdrawButtonDisabled
              ]}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Text style={styles.withdrawButtonText}>
                Withdraw {amount ? amount : '0.00'} tvETH
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
  balanceCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  balanceLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceValue: {
    color: '#fff',
    fontWeight: '600',
  },
  maxButton: {
    backgroundColor: '#3f3f46',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maxButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  withdrawButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 8,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});