import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DepositModal } from '../components/DepositModal';
import { WithdrawModal } from '../components/WithdrawModal';
import { useWalletStore } from '../store/walletStore';
import { useVaultStore } from '../store/vaultStore';
import { deposit, withdraw, getUserBalance, getEthBalance, getEthPrice } from '../services/apiService';

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
        <View style={styles.header}>
          <Text style={styles.title}>tinystable</Text>
          <Text style={styles.subtitle}>Earn stable yields on ETH</Text>
        </View>

        {/* APY Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Current APY</Text>
          {apy === '4.2' ? (
            <View style={styles.skeletonContainer}>
              <Animated.View
                style={[
                  styles.skeleton,
                  styles.skeletonApy,
                  {
                    opacity: shimmerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.7],
                    }),
                  }
                ]}
              />
            </View>
          ) : (
            <Text style={styles.apyText}>{apy}%</Text>
          )}
          <Text style={styles.cardSubtext}>Powered by Aave V3</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Balance</Text>
          <Text style={styles.balanceText}>{balance} ETH</Text>
          <Text style={styles.cardSubtext}>
            ≈ ${ethPrice > 0 ? (parseFloat(balance) * ethPrice).toFixed(2) : '0.00'} USD
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, isDepositing && styles.buttonDisabled]}
            onPress={() => setDepositModalVisible(true)}
            disabled={isDepositing || isWithdrawing}
          >
            <Text style={styles.primaryButtonText}>
              {isDepositing ? 'Depositing...' : 'Deposit ETH'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, isWithdrawing && styles.buttonDisabled]}
            onPress={() => setWithdrawModalVisible(true)}
            disabled={isDepositing || isWithdrawing}
          >
            <Text style={styles.secondaryButtonText}>
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Protocol Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TVL</Text>
              <Text style={styles.statValue}>{tvl}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Aave TVL</Text>
              <Text style={styles.statValue}>{userCount}</Text>
            </View>
          </View>
        </View>
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
    marginBottom: 8,
  },
  apyText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginRight: 8,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  skeletonContainer: {
    alignItems: 'flex-start',
  },
  skeleton: {
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  skeletonApy: {
    width: 80,
    height: 40,
  },
});