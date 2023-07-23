import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// // Auth
// const signIn = () => auth.signInWithPopup(provider);
// const signOut = () => auth.signOut();

// // Google Auth
// const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   prompt: "select_account",
// });

// // Set user to Firestore
// const createUserDocumentFromAuth = async (userAuth) => {
//   // 建立一個 document 實例
//   const userDocRef = doc(db, "users", userAuth.uid);

//   // 將 document 實例的資料取出來
//   const userSnapshot = await getDoc(userDocRef);
//   console.log(userSnapshot);
//   console.log(userSnapshot.exists());

//   // 如果使用者不存在
//   if (!userSnapshot.exists()) {
//     const { displayName, email } = userAuth;
//     const createdAt = new Date();
//     // 就把資料寫進 Firestore
//     try {
//       await setDoc(userDocRef, {
//         displayName,
//         email,
//         createdAt,
//       });
//       console.log("Sign in successfully!");
//     } catch (error) {
//       console.log("建立使用者失敗" + error.message);
//     }
//   }

//   // 如果使用者存在直接回傳 userDocRef
//   return userDocRef;
// };

// const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export { app, db, auth };
