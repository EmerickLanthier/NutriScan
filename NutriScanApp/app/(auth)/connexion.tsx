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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isCapsOn, setIsCapsOn] = useState(false);

    const router = useRouter();
    const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;

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

    const handleLogin = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userName', data.user.username);
                await AsyncStorage.setItem('userEmail', data.user.email);
                router.replace('/(tabs)');
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
                    onPress={() => router.replace('/(tabs)')}
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
                            <Text style={styles.titleText}>Connexion</Text>
                            <Text style={styles.subtitleText}>Heureux de vous revoir !</Text>
                        </View>

                        <View style={styles.formContainer}>
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

                            {}
                            <Text style={[styles.capsWarningText, { opacity: isCapsOn ? 1 : 0 }]}>
                                ⚠️ Majuscules activées
                            </Text>

                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => router.push('/(auth)/forgotPassword')}
                            >
                                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
                                <Text style={styles.loginButtonText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Pas encore de compte ? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text style={styles.registerText}>S'inscrire</Text>
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
        marginTop: -10, marginBottom: 15, marginLeft: 10, fontStyle: 'italic'
    },

    forgotPassword: { alignSelf: 'flex-end', marginBottom: 30 },
    forgotPasswordText: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555', textDecorationLine: 'underline' },
    loginButton: { width: '100%', height: 55, backgroundColor: '#DCDCDC', borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    loginButtonText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', fontWeight: 'bold' },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    footerText: { fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555' },
    registerText: { fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', fontWeight: 'bold', textDecorationLine: 'underline' },
});