import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  const [depositModalVisible, setDepositModalVisible] = React.useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = React.useState(false);

  const handleDeposit = (amount: string) => {
    console.log('Depositing:', amount);
    // TODO: Implement deposit logic
  };

  const handleWithdraw = (amount: string) => {
    console.log('Withdrawing:', amount);
    // TODO: Implement withdraw logic
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
          <Text style={styles.apyText}>4.2%</Text>
          <Text style={styles.cardSubtext}>Powered by Aave V3</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Balance</Text>
          <Text style={styles.balanceText}>0.00 ETH</Text>
          <Text style={styles.cardSubtext}>≈ $0.00 USD</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setDepositModalVisible(true)}
          >
            <Text style={styles.primaryButtonText}>Deposit ETH</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setWithdrawModalVisible(true)}
          >
            <Text style={styles.secondaryButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Protocol Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TVL</Text>
              <Text style={styles.statValue}>$0.00</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Users</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modals - Temporarily commented out until converted to StyleSheet */}
      {/* <DepositModal
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onDeposit={handleDeposit}
      />
      <WithdrawModal
        visible={withdrawModalVisible}
        onClose={() => setWithdrawModalVisible(false)}
        onWithdraw={handleWithdraw}
        maxAmount="0.00"
      /> */}
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
});