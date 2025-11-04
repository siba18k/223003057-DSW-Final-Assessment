import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
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
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    if (mounted) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: userData.displayName || firebaseUser.email,
                            ...userData
                        });

                        const onboardingStatus = await AsyncStorage.getItem(`onboarding_${firebaseUser.uid}`);
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
                    setUser(null);
                    setHasCompletedOnboarding(false);
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
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                displayName,
                email,
                createdAt: new Date().toISOString(),
                bookings: []
            });
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
            await AsyncStorage.setItem(`onboarding_${user.uid}`, 'completed');
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
