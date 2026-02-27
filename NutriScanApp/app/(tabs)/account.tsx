import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function ProfileScreen() {
    const router = useRouter();

    // Variables d'état (vides au départ)
    const [username, setUsername] = useState('Chargement...');
    const [email, setEmail] = useState('...');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                const storedEmail = await AsyncStorage.getItem('userEmail');

                if (storedName) setUsername(storedName);
                if (storedEmail) setEmail(storedEmail);
            } catch (error) {
                console.error("Erreur de chargement", error);
            }
        };
        loadUserData();
    }, []);

    const handleLogout = async () => {
        console.log("Déconnexion en cours...");
        // On vide la mémoire pour que le prochain utilisateur ne voie pas tes données !
        await AsyncStorage.clear();
        router.replace('/(auth)/connexion');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.mainContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    {/* --- EN-TÊTE DU PROFIL --- */}
                    <View style={styles.headerSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                                style={styles.avatarImage}
                            />
                        </View>
                        <Text style={styles.nameText}>{username}</Text>
                        <Text style={styles.emailText}>{email}</Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Mes Découvertes</Text>
                        <View style={styles.cardsContainer}>
                            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                                <Text style={styles.cardEmoji}>🍎</Text>
                                <Text style={styles.cardText}>Aliments{'\n'}Favoris</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                                <Text style={styles.cardEmoji}>📖</Text>
                                <Text style={styles.cardText}>Recettes{'\n'}Favorites</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Mon Compte</Text>

                        <View style={styles.menuBox}>
                            <TouchableOpacity style={styles.menuItem}>
                                <Text style={styles.menuItemText}>Modifier le profil</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.menuItem}>
                                <Text style={styles.menuItemText}>Préférences alimentaires</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.menuItem}>
                                <Text style={styles.menuItemText}>À propos de NutriScan</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F2EE' },
    mainContainer: { flex: 1 },
    scrollContainer: { paddingBottom: 40 },

    headerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        backgroundColor: '#F7F2EE'
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 15
    },
    avatarImage: { width: '100%', height: '100%' },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#1A1A1A',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#666',
        fontStyle: 'italic'
    },

    sectionContainer: {
        paddingHorizontal: 25,
        marginBottom: 35,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#1A1A1A',
        marginBottom: 15,
    },

    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    cardEmoji: {
        fontSize: 32,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        textAlign: 'center',
        color: '#333',
        fontWeight: '600',
        lineHeight: 22,
    },

    menuBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 25,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#333',
    },
    menuArrow: {
        fontSize: 20,
        color: '#CCC',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },

    logoutButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#FFF0F0',
        borderWidth: 1,
        borderColor: '#FFD6D6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#FF4747', // Texte rouge vif
        fontWeight: 'bold',
    },
});