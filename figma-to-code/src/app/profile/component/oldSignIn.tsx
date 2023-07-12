import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

// import {
//   signInWithGooglePopup,
//   createUserDocumentFromAuth,
// } from "@/app/firebase/firebase";

// export default function SignIn() {
//   const [userName, setUserName] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [userPhoto, setUserPhoto] = useState("");

//   const logGoogleUser = async () => {
//     const response = await signInWithGooglePopup();
//     console.log(response);

//     if (response) {
//       await createUserDocumentFromAuth(response.user);

//       const name: any = response.user.displayName;
//       const email: any = response.user.email;
//       const photo: any = response.user.photoURL;

//       setUserName(name);
//       setUserEmail(email);
//       setUserPhoto(photo);
//     }
//   };
//   const handleSignOut = () => {
//     const auth = getAuth();
//     signOut(auth)
//       .then(() => {
//         console.log("Sign out successfully!");
//       })
//       .catch((error) => {
//         console.log("Sign out error!");
//       });
//   };
//   return (
//     <div>
//       <img src={userPhoto}></img>
//       <div>{userName}</div>
//       <div>{userEmail}</div>

//       <button
//         onClick={logGoogleUser}
//         className="border-2 border-blue-400 rounded-xl text-black px-4"
//       >
//         Sign in with Google
//       </button>
//       <button
//         onClick={handleSignOut}
//         className="border-2 border-blue-400 rounded-xl text-black px-4"
//       >
//         Sign out
//       </button>
//     </div>
//   );
// }
//   const auth = getAuth();
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });
//   return <div>SignIn</div>;
