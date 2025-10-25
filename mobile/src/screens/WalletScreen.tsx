import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Eye, EyeOff } from 'lucide-react-native';

export function WalletScreen() {
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-white">Wallet</Text>
          <Text className="text-gray-400 mt-1">Manage your self-custody wallet</Text>
        </View>

        {/* Wallet Address */}
        <View className="bg-zinc-900 rounded-2xl p-6 mb-4 border border-zinc-800">
          <Text className="text-gray-400 text-sm mb-3">Your Address</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-mono text-xs flex-1">
              0x742d...b79b
            </Text>
            <TouchableOpacity className="ml-2 p-2">
              <Copy size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Private Key */}
        <View className="bg-zinc-900 rounded-2xl p-6 mb-4 border border-zinc-800">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-400 text-sm">Private Key</Text>
            <TouchableOpacity onPress={() => setShowPrivateKey(!showPrivateKey)}>
              {showPrivateKey ? (
                <EyeOff size={16} color="#9ca3af" />
              ) : (
                <Eye size={16} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-white font-mono text-xs">
            {showPrivateKey ? '0xac097...2ff80' : '••••••••••••••••'}
          </Text>
        </View>

        {/* Security Warning */}
        <View className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-800/30">
          <Text className="text-yellow-500 text-sm font-semibold mb-1">
            Security Warning
          </Text>
          <Text className="text-yellow-600/80 text-xs">
            Never share your private key. Anyone with access to it can steal your funds.
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-6 gap-3">
          <TouchableOpacity className="bg-white rounded-xl py-4 active:bg-gray-100">
            <Text className="text-black font-semibold text-center">Generate New Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-zinc-900 rounded-xl py-4 border border-zinc-800 active:bg-zinc-800">
            <Text className="text-white font-semibold text-center">Export Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-zinc-900 rounded-xl py-4 border border-zinc-800 active:bg-zinc-800">
            <Text className="text-white font-semibold text-center">Import Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}