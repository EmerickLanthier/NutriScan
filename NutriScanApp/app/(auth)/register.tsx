import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import {useRouter} from 'expo-router';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();

    const handleRegister = () => {
        console.log("Inscription de :", name, email);
        router.replace('../(auth)/connexion');    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View style={styles.headerContainer}>
                            <Text style={styles.titleText}>Inscription</Text>
                            <Text style={styles.subtitleText}>Créez votre compte</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom d'utilisateur"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
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

                            <TextInput
                                style={styles.input}
                                placeholder="Mot de passe"
                                placeholderTextColor="#888"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Confirmer le mot de passe"
                                placeholderTextColor="#888"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <TouchableOpacity style={styles.actionButton} onPress={handleRegister}>
                                <Text style={styles.actionButtonText}>S'inscrire</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Déjà un compte ? </Text>
                            <TouchableOpacity onPress={() => router.push('/connexion')}>
                                <Text style={styles.linkText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: '#F7F2EE'},
    keyboardView: {flex: 1},
    scrollContainer: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 20},
    headerContainer: {marginBottom: 40, alignItems: 'center', marginTop: 20},
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        marginBottom: 10
    },
    subtitleText: {fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555'},
    formContainer: {width: '100%'},
    input: {
        backgroundColor: '#FFFFFF',
        height: 55,
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        borderWidth: 1,
        borderColor: '#EFEFEF'
    },
    actionButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#DCDCDC',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    actionButtonText: {
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        fontWeight: 'bold'
    },
    footerContainer: {flexDirection: 'row', justifyContent: 'center', marginTop: 40, marginBottom: 20},
    footerText: {fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#555'},
    linkText: {
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
});