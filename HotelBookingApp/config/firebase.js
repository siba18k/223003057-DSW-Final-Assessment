import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

let auth;
try {
    auth = getAuth(app);
} catch (error) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

export { auth };
export const database = getDatabase(app);
export default app;
