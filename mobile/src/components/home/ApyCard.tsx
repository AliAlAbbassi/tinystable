import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ApyCardProps {
  apy: string;
  shimmerAnimation: Animated.Value;
}

export function ApyCard({ apy, shimmerAnimation }: ApyCardProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
  cardSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
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
