import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ListRenderItem, Platform
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import {router} from "expo-router";
import NavigationIcons from "@/components/ui/navigation-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HistoryItem {
    _id: string;
    barcode: string;
    name: string;
    image: string;
    nutriscore: string;
    scannedAt: string;
    favorite?: boolean; // Pour l'US-004
}

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/product/history`;

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            setHistoryData(data);
        } catch (error) {
            console.error(API_URL)
            console.error(`${process.env.EXPO_PUBLIC_API_URL}`)
            console.error("Erreur de récupération de l'historique:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const renderHistoryItem: ListRenderItem<HistoryItem> = ({ item }) => (
        <View style={styles.historyRow}>
            <View style={styles.productImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                ) : (
                    <View style={styles.placeholderImg} />
                )}
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>

            </View>

            <View style={styles.actionIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="star-outline" size={28} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="close" size={32} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.historyHeaderTitle}>
                <Text style={styles.historyHeaderText}>Historique complet</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#3D3D21" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={historyData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderHistoryItem}
                    style={styles.flatList}
                    contentContainerStyle={[
                        styles.listContent,
                        historyData.length === 0 && { flex: 1, justifyContent: 'center' }
                    ]}
                    onRefresh={fetchHistory}
                    refreshing={isLoading}
                    ListEmptyComponent={
                        <TouchableOpacity
                            style={styles.emptyStateContainer}
                            onPress={() => router.push('/scanner')}
                            activeOpacity={0.7}
                        >
                            <NavigationIcons size={80} name="barcode_1550324" color="rgba(255,255,255,0.4)" />

                            <Text style={styles.emptyTitle}>La liste est vide...</Text>
                            <Text style={styles.emptySubtitle}>Pour commencer, scannez un produit !</Text>
                        </TouchableOpacity>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6B7F45',
    },
    header: {
        paddingVertical: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    titleText: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
        ...Platform.select({
            ios: { fontFamily: 'Times New Roman' },
            android: { fontFamily: 'serif' },
        }),
    },
    placeholderBgLeavesLeft: {
        position: 'absolute',
        top: '15%',
        left: '-15%',
        width: '50%',
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 100,
        transform: [{ rotate: '45deg' }],
    },
    placeholderBgLeavesRight: {
        position: 'absolute',
        top: '25%',
        right: '-15%',
        width: '50%',
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 100,
        transform: [{ rotate: '-45deg' }],
    },
    listContent: {
        paddingHorizontal: 20,
        zIndex: 10,
    },
    historyRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(58, 71, 36, 0.8)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    productImageContainer: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImg: {
        flex: 1,
        backgroundColor: '#3A4724',
    },
    productDetails: {
        flex: 1,
        paddingLeft: 15,
    },
    productName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    barcodeText: {
        color: '#E0E0E0',
        fontSize: 12,
    },
    actionIcons: {
        flexDirection: 'row',
        gap: 10,
    },
    iconButton: {
        padding: 5,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#E0E0E0',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    historyHeaderTitle: {
        backgroundColor: '#E0E0E0',
        padding: 12,
        marginHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    historyHeaderText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#3D3D21'
    },
    flatList: {
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: 'rgba(58, 71, 36, 0.8)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden'
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        ...Platform.select({
            ios: { fontFamily: 'Times New Roman' },
            android: { fontFamily: 'serif' },
        }),
    },
    emptySubtitle: {
        color: '#E0E0E0',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
});