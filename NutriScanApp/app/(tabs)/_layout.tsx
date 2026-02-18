import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import NavigationIcons from '@/components/ui/navigation-icons';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].icon,
                tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabBarBackgroundColor,
                tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].tabBarBackgroundColor,


                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color }) => <NavigationIcons size={28} name="icons8-home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    title: 'Scanneur',
                    tabBarIcon: ({ color }) => <NavigationIcons size={28} name="barcode_1550324" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historique',
                    tabBarIcon: ({ color }) => <NavigationIcons size={28} name="arrow_13371679" color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <NavigationIcons size={28} name="codicon--account" color={color} />,
                }}
            />
        </Tabs>
    );
}
