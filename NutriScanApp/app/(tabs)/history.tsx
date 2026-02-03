import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ListRenderItem
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Product {
    id: string;
    name: string;
    score: string;
    image?: string;
}

const CATEGORIES = [
    {id: '1', name: 'Fruits'},
    {id: '2', name: 'Légumes'},
    {id: '3', name: 'Produits Laitiers'},
    {id: '4', name: 'Viandes'},
    {id: '5', name: 'Produits Céréaliers'},
    {id: '6', name: 'Autre'},
];

const HISTORY_DATA: Product[] = [
    {id: '1', name: 'Doritos', score: 'D', image: 'https://picsum.photos/100?chips'},
    {id: '2', name: 'Produit 2', score: 'A'},
    {id: '3', name: 'Produit 3', score: 'B'},
    {id: '4', name: 'Produit 4', score: 'C'},
    {id: '5', name: 'Produit 5', score: 'E'},
    {id: '6', name: 'Produit 6', score: 'B'},
    {id: '7', name: 'Produit 7', score: 'A'},
];

export default function App() {
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
                <Ionicons name="star" size={18} color="#FFD700"/>
                <Ionicons name="close-circle" size={20} color="#FF4444"/>
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerSection}>
                    <Text style={styles.sectionTitle}>Categorie</Text>
                    <View style={styles.grid}>
                        {CATEGORIES.map((cat) => (
                            <View key={cat.id} style={styles.categoryCard}>
                                <Text style={styles.categoryText}>{cat.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.historyHeaderTitle}>
                    <Text style={styles.historyHeaderText}>Historique complet</Text>
                </View>

                <FlatList
                    data={HISTORY_DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={renderHistoryItem}
                    style={styles.flatList}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

            </SafeAreaView>
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
        justifyContent: 'space-around',
        height: '100%',
        paddingVertical: 10,
        alignItems: 'center',
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
});