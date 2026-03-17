import React, { useState } from 'react';
import { TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams();
    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/resetPassword`;

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Succès 🎉", "Ton mot de passe a été mis à jour !", [
                    { text: "OK", onPress: () => router.replace('/(auth)/connexion') }
                ]);
            } else {
                Alert.alert("Erreur", data.message || "Le lien est invalide ou expiré.");
            }

        } catch (error) {
            console.error("Erreur réseau:", error);
            Alert.alert("Erreur", "Impossible de contacter le serveur NutriScan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Nouveau mot de passe</ThemedText>
            <ThemedText style={styles.subtitle}>Saisissez votre nouveau mot de passe ci-dessous.</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                placeholderTextColor="#999"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#999"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                <Button
                    title="Enregistrer"
                    onPress={handleResetPassword}
                    color="#4CAF50"
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        marginBottom: 30,
        textAlign: 'center',
        opacity: 0.7
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#000'
    }
});