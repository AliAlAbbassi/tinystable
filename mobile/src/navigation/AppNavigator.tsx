import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Wallet, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { WalletScreen } from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Settings</Text>
      <Text style={styles.placeholderSubtext}>Coming Soon</Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#27272a',
            borderTopWidth: 1,
            paddingVertical: 10,
            height: 70,
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <Home color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <Wallet color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <Settings color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholderSubtext: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
});