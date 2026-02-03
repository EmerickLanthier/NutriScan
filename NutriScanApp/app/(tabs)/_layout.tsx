import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="barcode" color={color} />,
        }}
      />
        <Tabs.Screen
            name="history"
            options={{
                title: 'Historique',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="return" color={color} />,
            }}
        />
        <Tabs.Screen
            name="account"
            options={{
                title: 'Profil',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="circlebadge" color={color} />,
            }}
        />
    </Tabs>
  );
}
