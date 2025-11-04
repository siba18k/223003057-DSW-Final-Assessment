import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBi9oqn6n_Gn8kJ9LkqWQp1_AwIvFdcUPk",
    authDomain: "adbeam-v2.firebaseapp.com",
    projectId: "adbeam-v2",
    storageBucket: "adbeam-v2.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
