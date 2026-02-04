import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProductData } from '@/services/openFoodFacts';

interface ProductDetailModalProps {
    visible: boolean;
    product: ProductData | null;
    onClose: () => void;
}

export default function ProductDetailModal({ visible, product, onClose }: ProductDetailModalProps) {
    //  si pas de produit, on n'affiche rien
    if (!product) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <IconSymbol name="xmark.circle.fill" size={30} color="#333" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                        <View style={styles.headerSection}>
                            {product.image ? (
                                <Image source={{ uri: product.image }} style={styles.productImage} />
                            ) : (
                                <View style={[styles.productImage, styles.placeholderImage]}>
                                    <Text style={{ color: '#888' }}>No Image</Text>
                                </View>
                            )}

                            <View style={styles.headerTexts}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.brandName}>{product.brands}</Text>
                                {product.quantity ? (
                                    <Text style={styles.quantityText}>Quantité : {product.quantity}</Text>
                                ) : null}
                            </View>
                        </View>

                        {product.labels && product.labels.length > 0 && (
                            <View style={styles.labelsContainer}>
                                {product.labels.map((label, index) => (
                                    <View key={index} style={styles.labelBadge}>
                                        <Text style={styles.labelText}>
                                            {label.replace('en:', '').replace(/-/g, ' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.nutritionSection}>
                            <Text style={styles.sectionTitle}>Valeurs Nutritionnelles (pour 100g)</Text>

                            <View style={styles.nutritionTable}>
                                {product.nutritionRows.map((row, index) => (
                                    <NutritionRow
                                        key={index}
                                        label={row.label}
                                        value={row.value}
                                        unit={row.unit}
                                        bold={row.bold}
                                        subItem={row.subItem}
                                        last={index === product.nutritionRows.length - 1}
                                    />
                                ))}
                            </View>

                            {product.nutritionRows.length === 0 && (
                                <Text style={styles.emptyText}>Aucune donnée nutritionnelle disponible.</Text>
                            )}
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

interface NutritionRowProps {
    label: string;
    value: string;
    unit: string;
    bold?: boolean;
    subItem?: boolean;
    last?: boolean;
}

const NutritionRow = ({ label, value, unit, bold, subItem, last }: NutritionRowProps) => (
    <View style={[
        styles.nutriRow,
        last && styles.nutriRowLast,
        subItem && styles.nutriRowSub
    ]}>
        <Text style={[styles.nutriLabel, bold && styles.bold]}>
            {label}
        </Text>

        <View style={styles.valueContainer}>
            <Text style={[styles.nutriValue, bold && styles.bold]}>{value}</Text>
            <Text style={[styles.nutriUnit, bold && styles.bold]}> {unit}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        height: '85%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        padding: 5,
    },

    // Header
    headerSection: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee'
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTexts: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    brandName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    quantityText: {
        fontSize: 14,
        color: '#888',
    },

    // Labels
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 25,
    },
    labelBadge: {
        backgroundColor: '#e0f2f1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#b2dfdb'
    },
    labelText: {
        fontSize: 12,
        color: '#00695c',
        fontWeight: '600',
        textTransform: 'capitalize',
    },

    // Section Nutrition
    nutritionSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
        color: '#000',
    },
    nutritionTable: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#666',
        marginTop: 5,
    },

    // Styles des lignes du tableau
    nutriRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    nutriRowSub: {
        paddingLeft: 35,
        backgroundColor: '#fbfbfb',
    },
    nutriRowLast: {
        borderBottomWidth: 0,
    },
    nutriLabel: {
        fontSize: 15,
        color: '#000',
        flex: 1,
        flexWrap: 'wrap',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        minWidth: 70,
        justifyContent: 'flex-end',
    },
    nutriValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    nutriUnit: {
        fontSize: 12,
        color: '#666',
        marginLeft: 2,
    },
    bold: {
        fontWeight: '900',
        color: '#000',
    },
});