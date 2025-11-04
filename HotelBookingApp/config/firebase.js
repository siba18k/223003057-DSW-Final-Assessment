import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDlXJXfvl_HV_Az8akLxpaOu-y-Oze_isA",
    authDomain: "adbeam.firebaseapp.com",
    databaseURL: "https://adbeam-default-rtdb.firebaseio.com",
    projectId: "adbeam",
    storageBucket: "adbeam.firebasestorage.app",
    messagingSenderId: "413534942519",
    appId: "1:413534942519:web:90096d118754fc71a896b2"
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
export  const db = getFirestore(app);
export default app;
