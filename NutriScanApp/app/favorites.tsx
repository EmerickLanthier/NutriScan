import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getFavoritesData, toggleFavorite } from '@/services/history';

interface HistoryItem {
    _id: string;
    barcode: string;
    name: string;
    image: string;
    nutriscore: string | null;
    favorite: boolean;
    last_updated: string;
}

const FavoritesScreen = () => {
    const router = useRouter();
    const [favoritesData, setFavoritesData] = useState<HistoryItem[]>([]);
    const [filteredData, setFilteredData] = useState<HistoryItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const applyFilterAndSort = (data: HistoryItem[], searchTerm: string, order: 'desc' | 'asc') => {
        let result = [...data];
        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.barcode.includes(searchTerm)
            );
        }

        result.sort((a, b) => {
            const getWeight = (s: string | null | undefined) => {
                const score = s?.toLowerCase();
                if (score === 'a') return 1;
                if (score === 'b') return 2;
                if (score === 'c') return 3;
                if (score === 'd') return 4;
                if (score === 'e') return 5;
                return 6;
            };

            const weightA = getWeight(a.nutriscore);
            const weightB = getWeight(b.nutriscore);

            return order === 'desc' ? weightB - weightA : weightA - weightB;
        });
        setFilteredData(result);
    };

    const getScoreColor = (score: string | null | undefined) => {
        switch (score?.toLowerCase()) {
            case 'a': return '#1e8449';
            case 'b': return '#2ecc71';
            case 'c': return '#f1c40f';
            case 'd': return '#e67e22';
            case 'e': return '#e74c3c';
            default: return '#95a5a6';
        }
    };
    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getFavoritesData();
            setFavoritesData(data);
            applyFilterAndSort(data, search, sortOrder);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de charger vos favoris.");
        } finally {
            setLoading(false);
        }
    }, [search, sortOrder]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFavorites();
        setRefreshing(false);
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        applyFilterAndSort(favoritesData, text, sortOrder);
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newOrder);
        applyFilterAndSort(favoritesData, search, newOrder);
    };

    const handleRemoveFavorite = async (id: string, name: string) => {
        Alert.alert(
            "Retirer des favoris",
            `Voulez-vous retirer "${name}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Retirer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await toggleFavorite(id);
                            setFavoritesData(prev => prev.filter(item => item._id !== id));
                            setFilteredData(prev => prev.filter(item => item._id !== id));
                        } catch (error) {
                            Alert.alert("Erreur", "Action impossible.");
                        }
                    }
                }
            ]
        );
    };

    const renderFavoriteItem = ({item}:{ item: HistoryItem }) => (
        <View style={[styles.itemContainer, { borderLeftColor: getScoreColor(item.nutriscore) }]}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productBarcode}>{item.barcode}</Text>
                {item.nutriscore && (
                    <Text style={[styles.nutriscoreBadge, { color: getScoreColor(item.nutriscore), backgroundColor: '#f8f9f9' }]}>
                        Score: {item.nutriscore.toUpperCase()}
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleRemoveFavorite(item._id, item.name)}
            >
                <Ionicons name="star" size={28} color="#FFD700" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Favoris</Text>
                <TouchableOpacity onPress={toggleSortOrder}>
                    <Ionicons
                        name={sortOrder === 'desc' ? "trending-down" : "trending-up"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#27ae60" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher..."
                    value={search}
                    onChangeText={handleSearch}
                    placeholderTextColor="#999"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#27ae60" />
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="star-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Aucun aliment favori trouvé.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderFavoriteItem}
                    contentContainerStyle={styles.listContent}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#27ae60',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eafaf1',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        height: 45,
        borderWidth: 1,
        borderColor: '#d1f2eb',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    emptyText: { fontSize: 16, color: '#666', marginTop: 20 },
    listContent: { paddingHorizontal: 15, paddingBottom: 20 },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#27ae60',
    },
    productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15, backgroundColor: '#f0f0f0' },
    productDetails: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    productBarcode: { fontSize: 12, color: '#888' },
    nutriscoreBadge: {
        fontSize: 12,
        color: '#27ae60',
        fontWeight: 'bold',
        marginTop: 4,
        backgroundColor: '#eafaf1',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    actionButton: { padding: 5 }
});

export default FavoritesScreen;