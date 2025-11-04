import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBi9oqn6n_Gn8kJ9LkqWQp1_AwIvFdcUPk",
    authDomain: "adbeam-v2.firebaseapp.com",
    projectId: "adbeam-v2",
    storageBucket: "adbeam-v2.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345"
};

let app;
let auth;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
