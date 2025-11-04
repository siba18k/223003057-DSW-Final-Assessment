import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlXJXfvl_HV_Az8akLxpaOu-y-Oze_isA",
    authDomain: "adbeam.firebaseapp.com",
    databaseURL: "https://adbeam-default-rtdb.firebaseio.com",
    projectId: "adbeam",
    storageBucket: "adbeam.firebasestorage.app",
    messagingSenderId: "413534942519",
    appId: "1:413534942519:web:90096d118754fc71a896b2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
