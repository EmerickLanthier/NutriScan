import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isCapsOn, setIsCapsOn] = useState(false);

    const router = useRouter();
    const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/register`;

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (text.length > 0) {
            const lastChar = text[text.length - 1];
            if (lastChar.toLowerCase() !== lastChar.toUpperCase()) {
                if (lastChar === lastChar.toUpperCase()) {
                    setIsCapsOn(true);
                } else {
                    setIsCapsOn(false);
                }
            }
        } else {
            setIsCapsOn(false);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Compte créé avec succès ! Tu peux maintenant te connecter.");
                router.replace('/(auth)/connexion');
            } else {
                alert("Erreur : " + data.message);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de se connecter au serveur.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={30} color="#1A1A1A" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.mainContainer}>

                        <View style={styles.headerContainer}>
                            <Text style={styles.titleText}>Inscription</Text>
                            <Text style={styles.subtitleText}>Créez votre compte NutriScan</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom d'utilisateur"
                                placeholderTextColor="#888"
                                autoCapitalize="words"
                                value={username}
                                onChangeText={setUsername}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Adresse e-mail"
                                placeholderTextColor="#888"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Mot de passe"
                                    placeholderTextColor="#888"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    value={password}
                                    onChangeText={handlePasswordChange}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={24}
                                        color="#888"
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.capsWarningText, { opacity: isCapsOn ? 1 : 0 }]}>
                                ⚠️ Majuscules activées
                            </Text>

                            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
                                <Text style={styles.registerButtonText}>Créer mon compte</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Déjà un compte ? </Text>
                            {/* --- CORRECTION ICI : replace au lieu de push --- */}
                            <TouchableOpacity onPress={() => router.replace('/(auth)/connexion')}>
                                <Text style={styles.loginText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F2EE' },
    header: { width: '100%', paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-start', zIndex: 10 },
    backButton: { padding: 5, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 20 },
    keyboardView: { flex: 1 },
    mainContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 40 },
    headerContainer: { marginBottom: 50, alignItems: 'center' },
    titleText: { fontSize: 32, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', marginBottom: 10 },
    subtitleText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555' },
    formContainer: { width: '100%' },

    input: {
        backgroundColor: '#FFFFFF', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15,
        fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000',
        borderWidth: 1, borderColor: '#EFEFEF',
    },

    passwordContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
        height: 55, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EFEFEF',
    },
    passwordInput: {
        flex: 1, height: '100%', paddingHorizontal: 20,
        fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000',
    },
    eyeIcon: {
        paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center'
    },

    capsWarningText: {
        color: '#D2691E', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginTop: -10, marginBottom: 30, marginLeft: 10, fontStyle: 'italic'
    },

    registerButton: { width: '100%', height: 55, backgroundColor: '#1A1A1A', borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    registerButtonText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', fontWeight: 'bold' },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    footerText: { fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555' },
    loginText: { fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', fontWeight: 'bold', textDecorationLine: 'underline' },
});