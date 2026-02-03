import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';

export default function ScannerScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const isProcessing = useRef(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) =>{
        if (isProcessing.current) {
            return;
        }

        isProcessing.current = true;

        Alert.alert(
            "Code Scanné",
            `Valeur : ${data}`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        setTimeout(() => {
                            isProcessing.current = false;
                        }, 500);
                    }
                }
            ]
        );
    };

    if (hasPermission === null) return <View />;
    if (hasPermission === false) return <Text>Pas de caméra</Text>;

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Scanner</Text>
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={handleBarCodeScanned}
                />
                <View style={styles.laserLine} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.instruction}>
                    Vise un code-barres pour scanner
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: { marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold' },
    cameraContainer: {
        width: 300,
        height: 150,
        overflow: 'hidden',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
    },
    camera: { flex: 1 },
    laserLine: {
        position: 'absolute',
        top: '50%',
        width: '100%',
        height: 2,
        backgroundColor: 'red',
        opacity: 0.6,
    },
    footer: { marginTop: 30 },
    instruction: { color: '#666' }
});