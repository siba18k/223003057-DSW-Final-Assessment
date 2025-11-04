import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import OnboardingScreen from './screens/OnboardingScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ExploreScreen from './screens/ExploreScreen';
import HotelDetailsScreen from './screens/HotelDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import BookingSuccessScreen from './screens/BookingSuccessScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import AddReviewScreen from './screens/AddReviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
);

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Explore') {
                    iconName = focused ? 'search' : 'search-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}
    >
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="AddReview" component={AddReviewScreen} />
    </Stack.Navigator>
);

export default function App() {
    const [user, setUser] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
                if (!hasSeenOnboarding) {
                    setShowOnboarding(true);
                }
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleOnboardingComplete = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
    };

    if (isLoading) {
        return null;
    }

    return (
        <NavigationContainer>
            {user ? (
                showOnboarding ? (
                    <OnboardingScreen onComplete={handleOnboardingComplete} />
                ) : (
                    <MainStack />
                )
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}
