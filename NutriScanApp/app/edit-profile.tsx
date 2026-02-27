import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            const storedName = await AsyncStorage.getItem('userName');
            const storedEmail = await AsyncStorage.getItem('userEmail');
            if (storedName) setUsername(storedName);
            if (storedEmail) setEmail(storedEmail);
        };
        loadUserData();
    }, []);

    const handleSave = async () => {
        if (newPassword !== '') {
            if (currentPassword === '') {
                Alert.alert("Erreur", "Veuillez entrer votre mot de passe actuel pour pouvoir le modifier.");
                return;
            }
            if (newPassword !== confirmPassword) {
                Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas !");
                return;
            }
        }

        try {
            await AsyncStorage.setItem('userName', username);

            // TODO : Requête API pour envoyer le nouveau nom et (si rempli) l'ancien/nouveau mot de passe
            /*
            const response = await fetch('https://TON_APP_RENDER.onrender.com/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });
            */

            Alert.alert(
                "Succès",
                "Votre profil a été mis à jour !",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error("Erreur de sauvegarde :", error);
            Alert.alert("Erreur", "Impossible de sauvegarder les modifications.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Modifier le profil</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                                style={styles.avatarImage}
                            />
                            <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
                                <Ionicons name="camera" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formContainer}>

                        <Text style={styles.sectionSubtitle}>Informations générales</Text>

                        <Text style={styles.inputLabel}>Adresse e-mail</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={email}
                            editable={false}
                            placeholderTextColor="#888"
                        />

                        <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Votre nom"
                            placeholderTextColor="#888"
                        />

                        <View style={styles.divider} />
                        <Text style={styles.sectionSubtitle}>Sécurité</Text>

                        <Text style={styles.inputLabel}>Mot de passe actuel</Text>
                        <TextInput
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Requis pour changer de mot de passe"
                            placeholderTextColor="#888"
                            secureTextEntry
                        />

                        <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Laisser vide pour ne pas changer"
                            placeholderTextColor="#888"
                            secureTextEntry
                        />

                        {/* CONFIRMER LE MOT DE PASSE */}
                        {newPassword.length > 0 && (
                            <View>
                                <Text style={styles.inputLabel}>Confirmer le nouveau mot de passe</Text>
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Retapez le nouveau mot de passe"
                                    placeholderTextColor="#888"
                                    secureTextEntry
                                />
                            </View>
                        )}

                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F2EE' },
    keyboardView: { flex: 1 },
    scrollContainer: { paddingBottom: 40, paddingHorizontal: 25 },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#1A1A1A' },
    placeholder: { width: 38 },

    avatarSection: { alignItems: 'center', marginVertical: 30 },
    avatarContainer: { position: 'relative', width: 130, height: 130 },
    avatarImage: { width: '100%', height: '100%', borderRadius: 65, borderWidth: 3, borderColor: '#FFF' },
    editBadge: { position: 'absolute', bottom: 0, right: 5, backgroundColor: '#1A1A1A', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F7F2EE' },

    formContainer: { width: '100%' },
    sectionSubtitle: { fontSize: 18, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#1A1A1A', marginBottom: 15, marginTop: 10 },
    divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
    inputLabel: { fontSize: 15, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#333', marginBottom: 8, marginLeft: 5 },
    input: { backgroundColor: '#FFFFFF', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 25, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#000', borderWidth: 1, borderColor: '#EFEFEF' },
    disabledInput: { backgroundColor: '#EAEAEA', color: '#888', borderColor: '#D0D0D0' },

    footer: { paddingHorizontal: 25, paddingBottom: Platform.OS === 'ios' ? 10 : 25, paddingTop: 10, backgroundColor: '#F7F2EE' },
    saveButton: { width: '100%', height: 55, backgroundColor: '#1A1A1A', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    saveButtonText: { fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFFFFF', fontWeight: 'bold' },
});