import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
    const [currentScreen, setCurrentScreen] = useState(0);

    const screens = [
        {
            title: 'Discover Amazing Hotels',
            description: 'Find the perfect place to stay for your next adventure',
            image: require('../assets/onboarding1.png'),
        },
        {
            title: 'Easy Booking Process',
            description: 'Book your favorite hotels with just a few taps',
            image: require('../assets/onboarding2.png'),
        },
        {
            title: 'Great Deals & Reviews',
            description: 'Get the best prices and read genuine reviews',
            image: require('../assets/onboarding3.png'),
        },
    ];

    const handleNext = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={screens[currentScreen].image} style={styles.image} />
                <Text style={styles.title}>{screens[currentScreen].title}</Text>
                <Text style={styles.description}>
                    {screens[currentScreen].description}
                </Text>
            </View>

            <View style={styles.pagination}>
                {screens.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentScreen === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                    {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#007AFF',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        width: width * 0.8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
