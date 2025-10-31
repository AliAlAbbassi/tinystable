import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DepositModal } from '../components/DepositModal';
import { WithdrawModal } from '../components/WithdrawModal';
import { useWalletStore } from '../store/walletStore';
import { useVaultStore } from '../store/vaultStore';
import { deposit, withdraw, getUserBalance, getEthBalance, getEthPrice } from '../services/apiService';
import { Header } from '../components/home/Header';
import { ApyCard } from '../components/home/ApyCard';
import { BalanceCard } from '../components/home/BalanceCard';
import { ActionButtons } from '../components/home/ActionButtons';
import { ProtocolStats } from '../components/home/ProtocolStats';

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

export function HomeScreen() {
  const [depositModalVisible, setDepositModalVisible] = React.useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = React.useState(false);
  const [isDepositing, setIsDepositing] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [ethPrice, setEthPrice] = React.useState(0);
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

  const { balance, address, privateKey, setBalance, loadWallet } = useWalletStore();
  const { apy, tvl, userCount, vaultBalance, rawVaultBalance, setVaultBalance, setRawVaultBalance, fetchVaultData } = useVaultStore();

  // Load wallet and fetch data when component mounts
  React.useEffect(() => {
    loadWallet();
    fetchEthPrice();
    fetchVaultData();

    // Start shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchEthPrice = async () => {
    try {
      const price = await getEthPrice();
      setEthPrice(price);
    } catch (error) {
      console.error('Failed to fetch ETH price:', error);
    }
  };

  // Fetch balances when address changes
  React.useEffect(() => {
    if (address) {
      refreshBalance();
    }
  }, [address]);

  const refreshBalance = async () => {
    if (!address) return;

    try {
      // Fetch both ETH balance and vault balance
      const [ethBalanceData, vaultBalanceData] = await Promise.all([
        getEthBalance(address),
        getUserBalance(address)
      ]);

      setBalance(ethBalanceData.balance || '0.00');
      setVaultBalance(vaultBalanceData.balance || '0.00');
      setRawVaultBalance(vaultBalanceData.shares || '0');
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const handleDeposit = async (amount: string) => {
    if (!address || !privateKey) {
      showAlert('Error', 'Please generate a wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showAlert('Error', 'Please enter a valid amount');
      return;
    }

    showAlert(
      'Confirm Deposit',
      `Deposit ${amount} ETH to earn yield?\n\nYou will receive ${amount} tvETH tokens.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deposit',
          onPress: async () => {
            setIsDepositing(true);
            try {
              const result = await deposit(address, amount, privateKey);
              showAlert('Success!', `Successfully deposited ${amount} ETH!\n\nTransaction: ${result.txHash || 'Pending'}`);
              await refreshBalance();
            } catch (error: any) {
              showAlert('Error', error.message || 'Failed to deposit. Please try again.');
            } finally {
              setIsDepositing(false);
            }
          }
        }
      ]
    );
  };

  const handleWithdraw = async (amount: string) => {
    if (!address || !privateKey) {
      showAlert('Error', 'Please generate a wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showAlert('Error', 'Please enter a valid amount');
      return;
    }

    const maxWithdraw = parseFloat(vaultBalance);
    if (parseFloat(amount) > maxWithdraw) {
      showAlert('Error', `Cannot withdraw more than ${vaultBalance} tvETH`);
      return;
    }

    showAlert(
      'Confirm Withdrawal',
      `Withdraw ${amount} tvETH?\n\nYou will receive approximately ${amount} ETH (plus earned yield).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            setIsWithdrawing(true);
            try {
              const result = await withdraw(address, amount, privateKey);
              showAlert('Success!', `Successfully withdrew ${amount} tvETH!\n\nTransaction: ${result.txHash || 'Pending'}`);
              await refreshBalance();
            } catch (error: any) {
              showAlert('Error', error.message || 'Failed to withdraw. Please try again.');
            } finally {
              setIsWithdrawing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <ApyCard apy={apy} shimmerAnimation={shimmerAnimation} />
        <BalanceCard balance={balance} ethPrice={ethPrice} />
        <ActionButtons isDepositing={isDepositing} isWithdrawing={isWithdrawing} onDeposit={() => setDepositModalVisible(true)} onWithdraw={() => setWithdrawModalVisible(true)} />
        <ProtocolStats tvl={tvl} userCount={userCount} />
      </ScrollView>

      {/* Modals */}
      <DepositModal
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onDeposit={handleDeposit}
      />
      <WithdrawModal
        visible={withdrawModalVisible}
        onClose={() => setWithdrawModalVisible(false)}
        onWithdraw={handleWithdraw}
        maxAmount={vaultBalance}
        rawMaxAmount={rawVaultBalance}
      />
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
});