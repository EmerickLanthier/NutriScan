import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    StatusBar,
    Platform,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function HomeContent() {
    const insets = useSafeAreaInsets();
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.circleDecoratorTop} />
            <View style={styles.circleDecoratorBottom} />

            <View style={[styles.topCornerContainer, { top: insets.top + 10 }]}>
                {showTooltip && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>
                            Naviguez vers le scanneur pour commencer
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => setShowTooltip(!showTooltip)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={showTooltip ? "close-circle" : "information-circle"}
                        size={28}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoGlassContainer}>
                    <Image
                        source={require('@/assets/images/NutriScan_Logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.glassCard}>
                    <View style={styles.imagePlaceholder}>
                        <Image
                            source={require('@/assets/images/meal.png')}
                            style={styles.featuredImage}
                        />
                        <View style={styles.imageOverlay} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>Mangez mieux, vivez mieux</Text>
                        <View style={styles.divider} />
                        <Text style={styles.bodyText}>
                            NutriScan vous aide à décoder les étiquettes alimentaires en un clin d'œil.
                            Scannez vos produits, analysez leur impact sur votre santé et découvrez
                            des alternatives plus saines pour votre quotidien.
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>🔍</Text>
                        <Text style={styles.statLabel}>Analyse{'\n'}instantanée</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>🥗</Text>
                        <Text style={styles.statLabel}>Scores{'\n'}précis</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>⭐</Text>
                        <Text style={styles.statLabel}>Favoris{'\n'}sauvés</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default function HomeScreen() {
    return (
        <SafeAreaProvider>
            <HomeContent />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6B7F45',
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    topCornerContainer: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoButton: {
        padding: 5,
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 12,
        marginRight: 2,
        maxWidth: 200,
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    circleDecoratorTop: {
        position: 'absolute',
        top: -width * 0.2,
        right: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    circleDecoratorBottom: {
        position: 'absolute',
        bottom: '8%',
        left: -width * 0.3,
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width * 0.35,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    logoGlassContainer: {
        width: '90%',
        height: 110,
        backgroundColor: 'rgba(84,62,62,0.12)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        borderWidth: 1.5,
        borderColor: 'rgba(229,220,220,0.57)',
    },
    logoImage: {
        width: '85%',
        height: '90%',
    },
    glassCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imagePlaceholder: {
        width: '100%',
        height: 220,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(58, 71, 36, 0.2)',
    },
    textContainer: {
        padding: 25,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        ...Platform.select({
            ios: { fontFamily: 'Georgia' },
            android: { fontFamily: 'serif' },
        }),
    },
    divider: {
        width: 50,
        height: 3,
        backgroundColor: '#FFFFFF',
        marginVertical: 15,
        borderRadius: 2,
        opacity: 0.6,
    },
    bodyText: {
        fontSize: 15,
        color: '#F0F0F0',
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.9,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 11,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});