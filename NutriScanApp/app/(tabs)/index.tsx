import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    StatusBar,
    Platform,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeContent() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="light-content" backgroundColor="#6B7F45" />

            <View style={styles.placeholderBgLeavesLeft} />
            <View style={styles.placeholderBgLeavesRight} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer} />

                <View style={styles.darkImageContainer}>
                    <View style={styles.placeholderFoodCollage} />
                </View>

                <Text style={styles.titleText}>Description temp.</Text>

                <Text style={styles.bodyText}>
                    Lorem ipsum dolor sit amet consectetur. A diam pulvinar enim mi nunc facilisis viverra.
                    Arcu amet ac tellus non neque urna integer. Leo at volutpat ac nunc pharetra adipiscing pellentesque.
                    Habitasse feugiat curabitur eget et est. Iaculis adipiscing vel vestibulum nulla nunc.
                </Text>
            </ScrollView>
        </View>
    );
}

export default function HomeScreen() {
    return (
        <SafeAreaProvider>
            <HomeContent />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6B7F45',
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: '8%',
        paddingVertical: 20,
    },
    placeholderBgLeavesLeft: {
        position: 'absolute',
        top: '25%',
        left: '-15%',
        width: '50%',
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 100,
        transform: [{ rotate: '45deg' }],
    },
    placeholderBgLeavesRight: {
        position: 'absolute',
        top: '30%',
        right: '-15%',
        width: '50%',
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 100,
        transform: [{ rotate: '-45deg' }],
    },
    logoContainer: {
        height: 60,
        marginBottom: '5%',
    },
    darkImageContainer: {
        width: '100%',
        aspectRatio: 0.8,
        backgroundColor: '#3A4724',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '8%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    placeholderFoodCollage: {
        width: '90%',
        height: '90%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 30,
    },
    titleText: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        ...Platform.select({
            ios: { fontFamily: 'Times New Roman' },
            android: { fontFamily: 'serif' },
        }),
    },
    bodyText: {
        fontSize: 16,
        color: '#E0E0E0',
        textAlign: 'center',
        lineHeight: 24,
    },
});