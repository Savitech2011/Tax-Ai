import { initializeApp } from 'firebase/app';
import { 
  browserLocalPersistence, 
  browserSessionPersistence, 
  getAuth, 
  inMemoryPersistence, 
  setPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .catch(() => setPersistence(auth, browserSessionPersistence))
  .catch(() => setPersistence(auth, inMemoryPersistence))
  .catch((error) => {
    console.error('Unable to set Firebase auth persistence:', error);
  });
