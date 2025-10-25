import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
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
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-zinc-900 rounded-t-3xl p-6 border-t border-zinc-800">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-xl font-bold">Deposit ETH</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-3">Amount to Deposit</Text>
            <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                className="text-white text-2xl font-bold"
              />
              <Text className="text-gray-500 text-sm mt-1">ETH</Text>
            </View>
          </View>

          {/* Info Card */}
          <View className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
            <Text className="text-gray-400 text-xs mb-2">You will receive:</Text>
            <Text className="text-white font-semibold">
              {amount ? `${amount} tvETH` : '0.00 tvETH'}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Current APY: 4.2% • Powered by Aave V3
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-zinc-800 rounded-xl py-4 border border-zinc-700"
            >
              <Text className="text-white font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeposit}
              className="flex-1 bg-white rounded-xl py-4"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Text className="text-black font-semibold text-center">
                Deposit {amount ? amount : '0.00'} ETH
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}