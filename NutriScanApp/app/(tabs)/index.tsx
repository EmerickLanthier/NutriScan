import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6B7F45" />
            <View style={styles.placeholderBgLeavesLeft} />
            <View style={styles.placeholderBgLeavesRight} />


            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>

                </View>


                <View style={styles.darkImageContainer}>
                    <View style={styles.placeholderFoodCollage}>
                    </View>
                </View>

                <Text style={styles.titleText}>Description temp.</Text>
                <Text style={styles.bodyText}>
                    Lorem ipsum dolor sit amet consectetur. A diam pulvinar enim mi nunc facilisis viverra. Arcu amet ac tellus non neque urna integer. Leo at volutpat ac nunc pharetra adipiscing pellentesque. Habitasse feugiat curabitur eget et est. Iaculis adipiscing vel vestibulum nulla nunc. Quisque purus lorem nulla senectus. Lorem ipsum habitant ut consequat mattis lorem curabitur velit faucibus.
                </Text>

                <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Description temp.</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6B7F45',
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 20 : 60,
        paddingHorizontal: 25,
    },

    placeholderBgLeavesLeft: {
        position: 'absolute',
        top: '30%',
        left: -50,
        width: 200,
        height: 300,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 100,
        transform: [{ rotate: '45deg' }],
    },
    placeholderBgLeavesRight: {
        position: 'absolute',
        top: '35%',
        right: -50,
        width: 200,
        height: 300,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 100,
        transform: [{ rotate: '-45deg' }],
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },

    logoTextContainer: {
        flexDirection: 'row',
    },
    logoTextNutri: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E4A3D',
    },
    logoTextScan: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
    },

    darkImageContainer: {
        width: width * 0.85,
        height: width * 1.1,
        backgroundColor: '#3A4724',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    placeholderFoodCollage: {
        width: '90%',
        height: '90%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },


    titleText: {
        fontSize: 32,
        color: '#FFFFFF',

        ...Platform.select({
            ios: { fontFamily: 'Times New Roman' },
            android: { fontFamily: 'serif' },
        }),
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    bodyText: {
        fontSize: 15,
        color: '#E0E0E0',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },

    buttonContainer: {
        backgroundColor: '#F28C28',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        ...Platform.select({
            ios: { fontFamily: 'Times New Roman' },
            android: { fontFamily: 'serif' },
        }),
    },
});
