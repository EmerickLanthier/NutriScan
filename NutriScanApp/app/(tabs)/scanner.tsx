import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { fetchProduct, ProductData } from '@/services/openFoodFacts';
import ProductDetailModal from '@/components/ProductDetailModal';
import { useIsFocused } from '@react-navigation/native';
import { addToHistory } from "@/services/history";

export default function ScannerScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<ProductData | null>(null);

    const isFocused = useIsFocused();
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
                await addToHistory(product);
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
    if (hasPermission === false) return <Text style={styles.errorText}>Pas d'accès à la caméra</Text>;

    if (!isFocused) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scanner un produit</Text>

            {/* Le conteneur qui limite la taille de la caméra */}
            <View style={styles.cameraWrapper}>
                {!modalVisible && (
                    <CameraView
                        style={styles.camera}
                        onBarcodeScanned={handleBarCodeScanned}
                    />
                )}

                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loadingText}>Analyse...</Text>
                    </View>
                )}
            </View>

            <Text style={styles.instructionText}>
                Alignez le code-barres dans le cadre ci-dessus
            </Text>

            <ProductDetailModal
                visible={modalVisible}
                product={scannedProduct}
                onClose={closeModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#444424',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    cameraWrapper: {
        width: 280,
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#4CAF50',
        position: 'relative',
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    instructionText: {
        color: '#ccc',
        fontSize: 15,
        marginTop: 40,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        flex: 1,
        color: 'white',
        backgroundColor: '#000',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});