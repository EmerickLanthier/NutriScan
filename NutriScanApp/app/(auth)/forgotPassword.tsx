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
    Keyboard
} from 'react-native';
import {useRouter} from 'expo-router';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleResetPassword = () => {
        console.log("Envoi du lien de réinitialisation à :", email);
        router.push('/connexion');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.mainContainer}>

                        <View style={styles.headerContainer}>
                            <Text style={styles.titleText}>Mot de passe oublié</Text>
                            <Text style={styles.subtitleText}>
                                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                            </Text>
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

                            <TouchableOpacity style={styles.actionButton} onPress={handleResetPassword}>
                                <Text style={styles.actionButtonText}>Envoyer le lien</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <TouchableOpacity onPress={() => router.push('/connexion')}>
                                <Text style={styles.linkText}>Retour à la connexion</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: '#F7F2EE'},
    keyboardView: {flex: 1},
    mainContainer: {flex: 1, justifyContent: 'center', paddingHorizontal: 30},
    headerContainer: {marginBottom: 40, alignItems: 'center'},
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        marginBottom: 15,
        textAlign: 'center'
    },
    subtitleText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10
    },
    formContainer: {width: '100%'},
    input: {
        backgroundColor: '#FFFFFF',
        height: 55,
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 25,
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
    footerContainer: {alignItems: 'center', marginTop: 40},
    linkText: {
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
});