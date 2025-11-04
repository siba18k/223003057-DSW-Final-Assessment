import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: userDoc.data()?.displayName || user.email,
                    ...userDoc.data()
                });

                const onboardingStatus = await AsyncStorage.getItem(`onboarding_${user.uid}`);
                setHasCompletedOnboarding(onboardingStatus === 'completed');
            } else {
                setUser(null);
                setHasCompletedOnboarding(false);
            }
            setIsLoading(false);
        });

        return unsubscribe;
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
