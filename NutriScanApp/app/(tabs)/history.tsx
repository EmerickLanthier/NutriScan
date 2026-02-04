import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ListRenderItem,
    Modal
} from 'react-native';
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Product {
    id: string;
    name: string;
    score: string;
    favorite: boolean;
    image?: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
}

const CATEGORIES = [
    {id: '1', name: 'Fruits et Légumes'},
    {id: '2', name: 'Produits Céréaliers'},
    {id: '3', name: 'Produits Laitiers'},
    {id: '4', name: 'Viandes'},
    {id: '5', name: 'Sucreries'},
    {id: '6', name: 'Autre'}
];

const INITIAL_DATA: Product[] = [
    {id: '1', name: 'Doritos', score: 'D', favorite: true, categoryId: '5'},
    {id: '2', name: 'Pommes', score: 'A', favorite: true, categoryId: '1'},
    {id: '3', name: 'Lait', score: 'B', favorite: false, categoryId: '3'},
    {id: '4', name: 'Poulet', score: 'C', favorite: true, categoryId: '4'},
    {id: '5', name: 'Bonbons', score: 'E', favorite: true, categoryId: '5'},
    {id: '6', name: 'Yaourt', score: 'B', favorite: false, categoryId: '3'},
    {id: '7', name: 'Riz', score: 'A', favorite: true, categoryId: '2'},
];

function NutritionScreen() {
    const insets = useSafeAreaInsets();
    const [historyData, setHistoryData] = useState<Product[]>(INITIAL_DATA);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const deleteProduct = (idToDelete: string) => {
        setHistoryData(currentList =>
            currentList.filter(item => item.id !== idToDelete)
        );
    };

    const toggleFavorite = (idToToggle: string) => {
        setHistoryData(currentList =>
            currentList.map(item =>
                item.id === idToToggle
                    ? {...item, favorite: !item.favorite} // On inverse le favori
                    : item
            )
        );
    };

    const renderHistoryItem: ListRenderItem<Product> = ({item}) => (
        <View style={styles.historyRow}>
            <View style={styles.productImageContainer}>
                {item.image ? (
                    <Image source={{uri: item.image}} style={styles.productImage}/>
                ) : (
                    <View style={styles.placeholderImg}/>
                )}
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Image
                    source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Nutri-score-B.svg/1200px-Nutri-score-B.svg.png'}}
                    style={styles.nutriscoreImg}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}
                                  style={styles.iconButton}>
                    <Ionicons
                        name={item.favorite ? "star" : "star-outline"}
                        size={32}
                        color="#FFD700"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(item.id)}
                                  style={styles.iconButton}>
                    <Ionicons name="close" size={36} color="#FF4444"/>
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredProducts = selectedCategory
        ? historyData.filter(p => p.categoryId === selectedCategory.id)
        : [];

    return (
        <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={selectedCategory !== null}
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={[styles.modalContainer, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#3D3D29"/>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {selectedCategory?.name}
                        </Text>
                        <View style={{width: 28}}/>
                    </View>

                    {filteredProducts.length > 0 ? (
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderHistoryItem}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Aucun produit dans cette catégorie</Text>
                        </View>
                    )}
                </View>
            </Modal>

            <View style={styles.headerSection}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.categoryCard}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={styles.categoryText}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.historyHeaderTitle}>
                <Text style={styles.historyHeaderText}>Historique complet</Text>
            </View>

            <FlatList
                data={historyData}
                keyExtractor={(item) => item.id}
                renderItem={renderHistoryItem}
                style={styles.flatList}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
        ;
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NutritionScreen/>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
    },
    headerSection: {
        padding: 20,
        height: SCREEN_HEIGHT * 0.35,
    },
    sectionTitle: {fontSize: 22, fontWeight: '900', marginBottom: 15},
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '30%',
        height: 70,
        backgroundColor: '#DCDCDC',
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    catImg: {...StyleSheet.absoluteFillObject, opacity: 0.6},
    categoryText: {fontSize: 10, fontWeight: 'bold', color: '#000', textAlign: 'center'},

    historyHeaderTitle: {
        backgroundColor: '#E0E0E0',
        padding: 12,
        marginHorizontal: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    historyHeaderText: {fontWeight: 'bold', fontSize: 16},

    flatList: {
        flex: 1,
        marginHorizontal: 15,
        backgroundColor: '#8E8E8E',
        marginBottom: 70,
    },
    listContent: {
        paddingBottom: 20,
    },
    historyRow: {
        flexDirection: 'row',
        height: 85,
        borderBottomWidth: 1,
        borderBottomColor: '#777',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    productImageContainer: {
        width: 65,
        height: 65,
        backgroundColor: '#555',
        borderRadius: 5,
    },
    productImage: {width: '100%', height: '100%', borderRadius: 5},
    placeholderImg: {flex: 1, backgroundColor: '#666'},
    productDetails: {
        flex: 1,
        paddingLeft: 15,
    },
    productName: {color: 'white', fontWeight: 'bold', fontSize: 14, marginBottom: 5},
    nutriscoreImg: {width: 70, height: 25},
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingRight: 5
    },
    iconButton: {
        padding: 5,
    },
    bottomTab: {
        flexDirection: 'row',
        backgroundColor: '#3D3D29',
        height: 70,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F5F5F0',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#3D3D29',
    },
    backButton: {
        padding: 5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        fontStyle: 'italic'
    }
});