import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: 1,
        title: 'Discover Amazing Hotels',
        subtitle: 'Find the perfect place to stay for your next adventure',
        image: require('../Materials/01-Onboarding Page/Onboarding 1.png'),
    },
    {
        id: 2,
        title: 'Book Your Stay',
        subtitle: 'Easy booking process with instant confirmation',
        image: require('../Materials/01-Onboarding Page/Onboarding 2.png'),
    },
    {
        id: 3,
        title: 'Enjoy Your Journey',
        subtitle: 'Create memorable experiences at handpicked hotels',
        image: require('../Materials/01-Onboarding Page/Onboarding 3.png'),
    },
];

const OnboardingScreen = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { completeOnboarding } = useAuth();

    const handleNext = () => {
        if (currentPage < onboardingData.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const page = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentPage(page);
                }}
            >
                {onboardingData.map((item, index) => (
                    <View key={item.id} style={styles.page}>
                        <Image source={item.image} style={styles.image} resizeMode="contain" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentPage ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                        <Text style={styles.nextText}>
                            {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    page: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        marginBottom: 50,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#007AFF',
    },
    inactiveDot: {
        backgroundColor: '#E5E5E5',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skipButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    skipText: {
        fontSize: 16,
        color: '#999',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    nextText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
