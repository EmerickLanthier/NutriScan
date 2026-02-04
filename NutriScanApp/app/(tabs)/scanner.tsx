import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { fetchProduct, ProductData } from '@/services/openFoodFacts';
import ProductDetailModal from '@/components/ProductDetailModal'; //pour la modale

export default function ScannerScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<ProductData | null>(null);

    const isProcessing = useRef(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
        if (isProcessing.current || modalVisible) return;

        isProcessing.current = true;
        setIsLoading(true);

        try {
            const product = await fetchProduct(data);
            if (product) {
                setScannedProduct(product);
                setModalVisible(true);
            } else {
                Alert.alert("Introuvable", "Produit non trouvé sur OpenFoodFacts", [
                    { text: "OK", onPress: resetScannerLock }
                ]);
            }
        } catch (error) {
            Alert.alert("Erreur", "Vérifiez votre connexion internet", [
                { text: "OK", onPress: resetScannerLock }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setScannedProduct(null);
        resetScannerLock();
    };

    const resetScannerLock = () => {
        setTimeout(() => {
            isProcessing.current = false;
        }, 1000);
    };

    if (hasPermission === null) return <View style={styles.container} />;
    if (hasPermission === false) return <Text>Pas d'accès à la caméra</Text>;

    return (
        <View style={styles.container}>
            {/* 1. LA CAMÉRA */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={handleBarCodeScanned}
            />

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Analyse...</Text>
                </View>
            )}

            {!modalVisible && !isLoading && (
                <View style={styles.overlayUI}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.instructionText}>Visez un code-barres</Text>
                </View>
            )}

            <ProductDetailModal
                visible={modalVisible}
                product={scannedProduct}
                onClose={closeModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20
    },
    loadingText: { color: 'white', marginTop: 10, fontWeight: 'bold' },
    overlayUI: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 5
    },
});