import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut} from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: 'AIzaSyA9TRcmGNCC8zF1YEZB67chxeBwK5Xp4HU',
  authDomain: 'react-firebase-auth-93c06.firebaseapp.com',
  projectId: 'react-firebase-auth-93c06',
  storageBucket: 'react-firebase-auth-93c06.appspot.com',
  messagingSenderId: '388513152774',
  appId: '1:388513152774:web:8513c438ce7c0402fee887',
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();


const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider)
    const user = res.user;
    localStorage.setItem("token", res.user);
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
      });
    
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logout = () => {
  signOut(auth)
};


export { auth, signInWithGoogle, logout, db, collection, addDoc, getDocs };