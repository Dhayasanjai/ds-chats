import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyDtrDnuKpHnifQd1b53R0VBzabj1jihUQo',
  authDomain: 'dhaya-whatsapp.firebaseapp.com',
  projectId: 'dhaya-whatsapp',
  storageBucket: 'dhaya-whatsapp.appspot.com',
  messagingSenderId: '14350989562',
  appId: '1:14350989562:web:083631aa076fb8348ff143',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);
export const storage = getStorage(app);
