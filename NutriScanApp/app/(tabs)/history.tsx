import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ListRenderItem, Platform,
    Alert,
    TextInput
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import {router} from "expo-router";
import NavigationIcons from "@/components/ui/navigation-icons";
import {API_URL_HISTORY, deleteHistoryItem, getHistoryData} from "@/services/history";

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

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [sortBy, setSortBy] = useState<'scannedAt' | 'nutriscore' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const data = await getHistoryData(sortBy, sortOrder, debouncedSearch);
            setHistoryData(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur de récupération de l'historique:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [sortBy, sortOrder, debouncedSearch]);

    const handleCloseSearch = () => {
        if (searchQuery !== '') {
            setSearchQuery('');
            setIsSearchActive(false);
        } else {
            setIsSearchActive(false);
        }
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous supprimer ce produit de l'historique ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteHistoryItem(id);

                        if (success) {
                            setHistoryData((prevData) =>
                                prevData.filter((item) => item._id !== id)
                            );
                        } else {
                            Alert.alert("Erreur", "La suppression a échoué.");
                        }
                    }
                }
            ]
        );
    };

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
                {item.nutriscore && (
                    <Text style={styles.nutriscoreText}>Nutriscore: {item.nutriscore.toUpperCase()}</Text>
                )}
            </View>

            <View style={styles.actionIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="star-outline" size={28} color="#FFD700" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                        confirmDelete(item._id)
                }
                >
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

            <View style={styles.controlsContainer}>

                {isSearchActive ? (
                    <View style={styles.expandedSearchWrapper}>
                        <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
                        <TextInput
                            style={styles.expandedSearchInput}
                            placeholder="Rechercher..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                            autoFocus={true}
                        />
                        <TouchableOpacity onPress={handleCloseSearch} style={styles.rightAlignedClearButton}>
                            <Ionicons name="close-circle" size={22} color="rgba(255,255,255,0.6)" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={() => setIsSearchActive(true)}
                            style={styles.collapsedSearchIcon}
                        >
                            <Ionicons name="search" size={22} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={styles.sortLabel}>Trier par :</Text>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'scannedAt' && styles.activeSortButton]}
                            onPress={() => setSortBy('scannedAt')}
                        >
                            <Text style={[styles.sortText, sortBy === 'scannedAt' && styles.activeSortText]}>Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'nutriscore' && styles.activeSortButton]}
                            onPress={() => setSortBy('nutriscore')}
                        >
                            <Text style={[styles.sortText, sortBy === 'nutriscore' && styles.activeSortText]}>Nutriscore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.orderButton}
                            onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            disabled={!sortBy}
                        >
                            <Ionicons
                                name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={20}
                                color={sortBy ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                            />
                        </TouchableOpacity>
                        {sortBy && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => {
                                    setSortBy(null);
                                    setSortOrder('desc');
                                }}
                            >
                                <Ionicons name="close-circle" size={24} color="#FF4444" />
                            </TouchableOpacity>
                        )}
                    </>
                )}
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
    nutriscoreText: {
        color: '#E0E0E0',
        fontSize: 12,
        fontWeight: 'bold',
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
    sortContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(58, 71, 36, 0.95)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        gap: 8,
    },
    sortLabel: {
        color: '#E0E0E0',
        fontSize: 12,
        marginRight: 4,
    },
    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeSortButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    sortText: {
        color: '#E0E0E0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeSortText: {
        color: '#3A4724',
    },
    orderButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    clearButton: {
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(58, 71, 36, 0.7)',
        marginHorizontal: 20,
        marginTop: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    clearSearchButton: {
        padding: 5,
        marginLeft: 5,
    },
    controlsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(58, 71, 36, 0.95)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        gap: 8,
        height: 55,
    },
    collapsedSearchIcon: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    expandedSearchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: 40,
    },
    expandedSearchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        height: '100%',
    },
    rightAlignedClearButton: {
        marginLeft: 'auto',
        padding: 4,
    }
});