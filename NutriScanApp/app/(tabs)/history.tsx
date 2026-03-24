import React, { useState, useCallback, useEffect } from 'react';
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
    ListRenderItem,
    Platform,
    Alert,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import NavigationIcons from "@/components/ui/navigation-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteHistoryItem, getHistoryData, getFullProductDetails, toggleFavorite} from "@/services/history";
import ProductDetailModal from '@/components/ProductDetailModal';
import { ProductData } from '@/services/openFoodFacts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HistoryItem {
    _id: string;
    barcode: string;
    name: string;
    image: string;
    nutriscore: string;
    scannedAt: string;
    favorite?: boolean;
}

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();

    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [sortBy, setSortBy] = useState<'last_updated' | 'nutriscore' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [isProductLoading, setIsProductLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const checkAuthAndFetchHistory = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                setIsLoggedIn(true);
                const data = await getHistoryData(sortBy, sortOrder, debouncedSearch);
                setHistoryData(data);
            } else {
                setIsLoggedIn(false);
                setHistoryData([]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            checkAuthAndFetchHistory();
        }, [sortBy, sortOrder, debouncedSearch])
    );

    const handleCloseSearch = () => {
        setSearchQuery('');
        setIsSearchActive(false);
    };

    const handleProductPress = async (barcode: string) => {
        setIsProductLoading(true);
        const productDetails = await getFullProductDetails(barcode);
        if (productDetails) {
            setSelectedProduct(productDetails);
            setModalVisible(true);
        } else {
            Alert.alert("Erreur", "Impossible de récupérer les détails de ce produit.");
        }
        setIsProductLoading(false);
    };

    const handleToggleFavorite = async (id: string) => {
        const result = await toggleFavorite(id);
        setHistoryData(prev => prev.map(item =>
            item._id === id ? { ...item, favorite: !item.favorite } : item
        ));
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
        <TouchableOpacity
            style={styles.historyRow}
            onPress={() => handleProductPress(item.barcode)}
            activeOpacity={0.7}
        >
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
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleToggleFavorite(item._id)}
                >
                    <Ionicons
                        name={item.favorite ? "star" : "star-outline"}
                        size={28}
                        color="#FFD700"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => confirmDelete(item._id)}
                >
                    <Ionicons name="close" size={32} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.historyHeaderTitle}>
                <Text style={styles.historyHeaderText}>Historique complet</Text>
            </View>

            {!isLoggedIn ? (
                <View style={styles.guestContainer}>
                    <View style={styles.guestIconContainer}>
                        <Text style={styles.guestIcon}>🔒</Text>
                    </View>
                    <Text style={styles.emptyTitle}>Mode Invité</Text>
                    <Text style={styles.emptySubtitle}>
                        Connectez-vous pour sauvegarder vos découvertes et retrouver tout votre historique de scan.
                    </Text>
                    <TouchableOpacity
                        style={styles.loginButtonPrimary}
                        onPress={() => router.push('/(auth)/connexion')}
                    >
                        <Text style={styles.loginButtonTextPrimary}>Créer un compte ou se connecter</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
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
                                <Text style={styles.sortLabel}>Trier :</Text>
                                <TouchableOpacity
                                    style={[styles.sortButton, sortBy === 'last_updated' && styles.activeSortButton]}
                                    onPress={() => setSortBy('last_updated')}
                                >
                                    <Text style={[styles.sortText, sortBy === 'last_updated' && styles.activeSortText]}>Date</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sortButton, sortBy === 'nutriscore' && styles.activeSortButton]}
                                    onPress={() => setSortBy('nutriscore')}
                                >
                                    <Text style={[styles.sortText, sortBy === 'nutriscore' && styles.activeSortText]}>Score</Text>
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
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        </View>
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
                            onRefresh={checkAuthAndFetchHistory}
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
                </>
            )}

            {isProductLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            )}

            <ProductDetailModal
                visible={modalVisible}
                product={selectedProduct}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedProduct(null);
                    checkAuthAndFetchHistory();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#6B7F45' },
    historyHeaderTitle: {
        backgroundColor: '#E0E0E0',
        padding: 12,
        marginHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    historyHeaderText: { fontWeight: 'bold', fontSize: 16, color: '#3D3D21' },
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

    flatList: {
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: 'rgba(58, 71, 36, 0.8)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden'
    },
    listContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 20 },
    historyRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(58, 71, 36, 0.8)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    productImageContainer: { width: 60, height: 60, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, overflow: 'hidden' },
    productImage: { width: '100%', height: '100%' },
    placeholderImg: { flex: 1, backgroundColor: '#3A4724' },
    productDetails: { flex: 1, paddingLeft: 15 },
    productName: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    nutriscoreText: { color: '#E0E0E0', fontSize: 12, fontWeight: 'bold' },
    actionIcons: { flexDirection: 'row', gap: 10 },
    iconButton: { padding: 5 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        ...Platform.select({ ios: { fontFamily: 'Times New Roman' }, android: { fontFamily: 'serif' } })
    },
    emptySubtitle: { color: '#E0E0E0', fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 22 },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginHorizontal: 20,
        backgroundColor: 'rgba(58, 71, 36, 0.8)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    guestIconContainer: {
        width: 80, height: 80,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    guestIcon: { fontSize: 35 },
    loginButtonPrimary: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    loginButtonTextPrimary: {
        color: '#3D3D21',
        fontSize: 16,
        fontWeight: 'bold',
        ...Platform.select({ ios: { fontFamily: 'Times New Roman' }, android: { fontFamily: 'serif' } })
    },
    sortLabel: { color: '#E0E0E0', fontSize: 12 },
    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
    },
    activeSortButton: { backgroundColor: '#FFFFFF' },
    sortText: { color: '#E0E0E0', fontSize: 12, fontWeight: 'bold' },
    activeSortText: { color: '#3A4724' },
    orderButton: { padding: 4, marginLeft: 'auto' },
    clearButton: { padding: 2 },
    searchIcon: { marginRight: 8 },
    collapsedSearchIcon: { padding: 6, marginRight: 4 },
    expandedSearchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: 40,
    },
    expandedSearchInput: { flex: 1, color: '#FFFFFF', fontSize: 16 },
    rightAlignedClearButton: { marginLeft: 'auto', padding: 4 },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});