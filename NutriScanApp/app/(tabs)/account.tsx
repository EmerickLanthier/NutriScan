import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 2;

export default function ProfileScreen() {
    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.headerSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                                style={styles.avatarImage}
                            />
                        </View>
                    </View>

                    <Text style={styles.greetingText}>Bonjour, (nom d’utilisateur)</Text>

                    <View style={styles.cardsContainer}>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>
                                Aliments{'\n'}Favoris
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>
                                Recettes{'\n'}Favorites
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.othersSection}>
                        <Text style={styles.sectionTitle}>Autres</Text>
                        <Text style={styles.loremText}>
                            Lorem ipsum dolor sit amet consectetur. Sed fermentum eu suspendisse nunc.
                            Platea elit proin sed placerat ut tristique tristique. Venenatis rhoncus interdum
                            pellentesque hendrerit id turpis eget purus sed. Quam pretium morbi molestie.
                        </Text>
                    </View>

                </ScrollView>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F7F2EE',
    },
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 100,
        alignItems: 'center',
    },

    headerSection: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 180,
        width: '100%',
    },
    watermarkImage: {
        position: 'absolute',
        width: 200,
        height: 100,
        opacity: 0.1,
        tintColor: 'green',
        resizeMode: 'contain',
        top: 10,
    },
    avatarContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#F7F2EE',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },

    greetingText: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#000',
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
    },

    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    card: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        backgroundColor: '#DCDCDC',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        textAlign: 'center',
        color: '#000',
        fontWeight: '500',
        lineHeight: 28,
    },

    othersSection: {
        width: '100%',
        paddingHorizontal: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: 10,
        textAlign: 'left',
    },
    loremText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        lineHeight: 24,
        textAlign: 'justify',
        color: '#1A1A1A',
    },

});