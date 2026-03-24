import React, {useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ListRenderItem,
    Platform,
    Alert,
    TextInput
} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';
import {router} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteHistoryItem, getHistoryData, getFullProductDetails, toggleFavorite} from "@/services/history";
import ProductDetailModal from '@/components/ProductDetailModal';
import {ProductData} from '@/services/openFoodFacts';

interface HistoryItem {
    _id: string;
    barcode: string;
    name: string;
    image: string;
    nutriscore: string;
    last_updated: string;
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
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
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
            }
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            checkAuthAndFetchHistory();
        }, [sortBy, sortOrder, debouncedSearch])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScoreColor = (score: string | null | undefined) => {
        switch (score?.toLowerCase()) {
            case 'a':
                return '#1e8449';
            case 'b':
                return '#2ecc71';
            case 'c':
                return '#f1c40f';
            case 'd':
                return '#e67e22';
            case 'e':
                return '#e74c3c';
            default:
                return 'rgba(255, 255, 255, 0.3)';
        }
    };

    const handleProductPress = async (barcode: string) => {
        setIsProductLoading(true);
        const productDetails = await getFullProductDetails(barcode);
        if (productDetails) {
            setSelectedProduct(productDetails);
            setModalVisible(true);
        }
        setIsProductLoading(false);
    };

    const handleToggleFavorite = async (id: string) => {
        await toggleFavorite(id);
        setHistoryData(prev => prev.map(item =>
            item._id === id ? {...item, favorite: !item.favorite} : item
        ));
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            "Supprimer",
            "Retirer ce produit de l'historique ?",
            [
                {text: "Annuler", style: "cancel"},
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteHistoryItem(id);
                        if (success) {
                            setHistoryData((prev) => prev.filter((item) => item._id !== id));
                        }
                    }
                }
            ]
        );
    };

    const renderHistoryItem: ListRenderItem<HistoryItem> = ({item}) => (
        <TouchableOpacity
            style={[styles.historyRow, {borderLeftColor: getScoreColor(item.nutriscore)}]}
            onPress={() => handleProductPress(item.barcode)}
            activeOpacity={0.8}
        >
            <View style={styles.productImageContainer}>
                {item.image ? (
                    <Image source={{uri: item.image}} style={styles.productImage}/>
                ) : (
                    <View style={styles.placeholderImg}/>
                )}
            </View>
            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.dateText}>{formatDate(item.last_updated)}</Text>
                {item.nutriscore && (
                    <View style={[styles.nutriscoreBadge, {backgroundColor: getScoreColor(item.nutriscore)}]}>
                        <Text style={styles.nutriscoreBadgeText}>{item.nutriscore.toUpperCase()}</Text>
                    </View>
                )}
            </View>
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => handleToggleFavorite(item._id)} style={styles.iconBtn}>
                    <Ionicons
                        name={item.favorite ? "star" : "star-outline"}
                        size={22}
                        color={item.favorite ? "#FFD700" : "rgba(255,255,255,0.4)"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item._id)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={22} color="rgba(255,255,255,0.4)"/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, {paddingTop: insets.top + 20}]}>
                <Text style={styles.headerTitle}>Historique</Text>
                <TouchableOpacity onPress={() => setIsSearchActive(!isSearchActive)} style={styles.iconCircle}>
                    <Ionicons name={isSearchActive ? "close" : "search"} size={20} color="white"/>
                </TouchableOpacity>
            </View>

            {!isLoggedIn ? (
                <View style={styles.guestContainer}>
                    <Ionicons name="lock-closed-outline" size={50} color="rgba(255,255,255,0.2)"/>
                    <Text style={styles.guestTitle}>Mode Invité</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/connexion')}>
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.flexContainer}>
                    {isSearchActive && (
                        <View style={styles.searchWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Rechercher..."
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />
                        </View>
                    )}

                    <View style={styles.filterSection}>
                        <View style={styles.filterBar}>
                            <TouchableOpacity
                                style={[styles.filterChip, sortBy === 'last_updated' && styles.activeChip]}
                                onPress={() => setSortBy('last_updated')}
                            >
                                <Text
                                    style={[styles.filterText, sortBy === 'last_updated' && styles.activeFilterText]}>Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterChip, sortBy === 'nutriscore' && styles.activeChip]}
                                onPress={() => setSortBy('nutriscore')}
                            >
                                <Text
                                    style={[styles.filterText, sortBy === 'nutriscore' && styles.activeFilterText]}>Score</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                              style={styles.sortToggle}>
                                <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={20}
                                          color="white"/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.separatorLine}/>
                    </View>

                    <FlatList
                        data={historyData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderHistoryItem}
                        contentContainerStyle={styles.listContent}
                        onRefresh={checkAuthAndFetchHistory}
                        refreshing={isLoading}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="barcode-outline" size={60} color="rgba(255,255,255,0.1)"/>
                                <Text style={styles.emptyTitle}>Aucun scan</Text>
                            </View>
                        }
                    />
                </View>
            )}

            <ProductDetailModal
                visible={modalVisible}
                product={selectedProduct}
                onClose={() => {
                    setModalVisible(false);
                    checkAuthAndFetchHistory();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#6B7F45'},
    flexContainer: {flex: 1},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 15
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchWrapper: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 25,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 45,
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    searchInput: {color: 'white', fontSize: 15},
    filterSection: {marginBottom: 15},
    filterBar: {flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 10, alignItems: 'center', gap: 12},
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    activeChip: {backgroundColor: 'white'},
    filterText: {color: 'white', fontWeight: 'bold', fontSize: 13},
    activeFilterText: {color: '#6B7F45'},
    sortToggle: {marginLeft: 'auto'},
    separatorLine: {height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 25, marginTop: 5},
    listContent: {paddingHorizontal: 25, paddingBottom: 40},
    historyRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderLeftWidth: 4
    },
    productImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    productImage: {width: '100%', height: '100%'},
    placeholderImg: {flex: 1, backgroundColor: 'rgba(255,255,255,0.05)'},
    productDetails: {flex: 1, marginLeft: 15},
    productName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
    },
    dateText: {color: 'rgba(255, 255, 255, 0.5)', fontSize: 11, marginTop: 2},
    nutriscoreBadge: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6},
    nutriscoreBadgeText: {color: 'white', fontWeight: 'bold', fontSize: 10},
    actionIcons: {flexDirection: 'row', gap: 5},
    iconBtn: {padding: 5},
    emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120},
    emptyTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
    },
    guestContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40},
    guestTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 25,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
    },
    loginButton: {backgroundColor: 'white', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 25},
    loginButtonText: {color: '#6B7F45', fontWeight: 'bold', fontSize: 15}
});