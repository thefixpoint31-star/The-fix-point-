import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Firebase Configuration with environment variable override support
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Singleton Firebase Application instance wrapper
export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

export const app: FirebaseApp = getFirebaseApp();

// Target Firestore database ID from config or environment
const targetDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId;

// Initialize Firestore Instance (supporting designated database ID)
export const getFirestoreInstance = (appInstance: FirebaseApp = app): Firestore => {
  if (targetDatabaseId && targetDatabaseId !== '(default)') {
    return getFirestore(appInstance, targetDatabaseId);
  }
  return getFirestore(appInstance);
};

// Export singleton instances
export const db: Firestore = getFirestoreInstance(app);
export const auth: Auth = getAuth(app);

export default {
  app,
  db,
  auth,
  firebaseConfig,
  getFirebaseApp,
  getFirestoreInstance,
};
