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

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/forgotPassword`;

    const handleResetPassword = async () => {
        if (!email) {
            alert("Veuillez entrer votre adresse e-mail.");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Si cette adresse existe, un lien de réinitialisation vous a été envoyé !");
                router.back();
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

            {}
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
                            <Text style={styles.titleText}>Mot de passe oublié</Text>
                            <Text style={styles.subtitleText}>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</Text>
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

                            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} activeOpacity={0.8}>
                                <Text style={styles.resetButtonText}>Envoyer le lien</Text>
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
    mainContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 100 },
    headerContainer: { marginBottom: 40, alignItems: 'center' },
    titleText: { fontSize: 28, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', marginBottom: 15, textAlign: 'center' },
    subtitleText: { fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555', textAlign: 'center', lineHeight: 22 },
    formContainer: { width: '100%' },

    input: {
        backgroundColor: '#FFFFFF', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 25,
        fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000',
        borderWidth: 1, borderColor: '#EFEFEF',
    },

    resetButton: { width: '100%', height: 55, backgroundColor: '#1A1A1A', borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    resetButtonText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', fontWeight: 'bold' },
});