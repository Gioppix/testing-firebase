import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAzajBBs3fKvpbbHi-gM4J2rlE1J9pji7M',
    authDomain: 'fir-project-c283f.firebaseapp.com',
    projectId: 'fir-project-c283f',
    storageBucket: 'fir-project-c283f.firebasestorage.app',
    messagingSenderId: '825106838060',
    appId: '1:825106838060:web:c12bf334d4beef1e945789'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
