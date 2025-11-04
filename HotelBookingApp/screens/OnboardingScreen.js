import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const OnboardingScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { completeOnboarding } = useAuth();

    const onboardingSteps = [
        {
            title: 'Welcome to Hotel Booking',
            description: 'Discover amazing hotels around the world',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
        },
        {
            title: 'Easy Booking',
            description: 'Book your perfect stay in just a few taps',
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400'
        },
        {
            title: 'Best Prices',
            description: 'Get the best deals and exclusive offers',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
        }
    ];

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={{ uri: onboardingSteps[currentStep].image }}
                    style={styles.image}
                />
                <Text style={styles.title}>{onboardingSteps[currentStep].title}</Text>
                <Text style={styles.description}>{onboardingSteps[currentStep].description}</Text>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.pagination}>
                    {onboardingSteps.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentStep && styles.activeDot
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 16,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
    },
    bottomContainer: {
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DDD',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#007AFF',
        width: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    skipButtonText: {
        fontSize: 16,
        color: '#666',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default OnboardingScreen;
