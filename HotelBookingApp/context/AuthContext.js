import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        let mounted = true;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!mounted) return;

            try {
                if (firebaseUser) {
                    let userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0]
                    };

                    // Try to get user profile from your existing users path (non-destructive)
                    try {
                        const userRef = ref(database, `users/${firebaseUser.uid}`);
                        const snapshot = await get(userRef);

                        if (snapshot.exists()) {
                            const existingData = snapshot.val();
                            userData = {
                                ...userData,
                                ...existingData
                            };
                        }
                        // Don't create user here to avoid conflicts with your existing system
                    } catch (dbError) {
                        console.log('Database access limited, using basic user data');
                    }

                    if (mounted) {
                        setUser(userData);
                        const onboardingStatus = await AsyncStorage.getItem(`hotelapp_onboarding_${firebaseUser.uid}`);
                        setHasCompletedOnboarding(onboardingStatus === 'completed');
                    }
                } else {
                    if (mounted) {
                        setUser(null);
                        setHasCompletedOnboarding(false);
                    }
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                if (mounted) {
                    if (firebaseUser) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.email.split('@')[0]
                        });
                        const onboardingStatus = await AsyncStorage.getItem(`hotelapp_onboarding_${firebaseUser.uid}`);
                        setHasCompletedOnboarding(onboardingStatus === 'completed');
                    } else {
                        setUser(null);
                        setHasCompletedOnboarding(false);
                    }
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Don't auto-create user in database to avoid conflicts with existing system
            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    const signin = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const completeOnboarding = async () => {
        if (user) {
            await AsyncStorage.setItem(`hotelapp_onboarding_${user.uid}`, 'completed');
            setHasCompletedOnboarding(true);
        }
    };

    const value = {
        user,
        signup,
        signin,
        logout,
        resetPassword,
        isLoading,
        hasCompletedOnboarding,
        completeOnboarding
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
