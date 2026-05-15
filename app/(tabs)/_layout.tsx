import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="card"
        options={{
          title: '카드',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: '챗봇',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: '증권',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="card-create" options={{ href: null }} />
      <Tabs.Screen name="card-application" options={{ href: null }} />
      <Tabs.Screen name="card-terms" options={{ href: null }} />
      <Tabs.Screen name="card-account" options={{ href: null }} />
      <Tabs.Screen name="card-etf" options={{ href: null }} />
      <Tabs.Screen name="card-complete" options={{ href: null }} />
      <Tabs.Screen name="card-reward" options={{ href: null }} />
      <Tabs.Screen name="card-reward-history" options={{ href: null }} />
      <Tabs.Screen name="card-reward-detail" options={{ href: null }} />
      <Tabs.Screen name="card-monthly-performance" options={{ href: null }} />
      <Tabs.Screen name="card-monthly-usage" options={{ href: null }} />
      <Tabs.Screen name="card-home-empty" options={{ href: null }} />
      <Tabs.Screen name="securities-no-account" options={{ href: null }} />
      <Tabs.Screen name="securities-account-open-step1" options={{ href: null }} />
      <Tabs.Screen name="securities-account-open-step2" options={{ href: null }} />
      <Tabs.Screen name="securities-complete" options={{ href: null }} />
      <Tabs.Screen name="etf-history" options={{ href: null }} />
      <Tabs.Screen name="etf-change" options={{ href: null }} />
      <Tabs.Screen name="etf-reward" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="profile-edit" options={{ href: null }} />
    </Tabs>
  );
}
