import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const provider = new GoogleAuthProvider();

export async function signIn() {
  const response = await signInWithPopup(auth, provider);
  return response;

  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // 登入成功，取得 token、user
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential?.accessToken;
  //       const user = result.user;
  //       console.log(token);
  //       console.log(user);
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       console.log(errorCode);
  //       console.log(errorMessage);
  //       console.log(credential);
  //     });
}

// export default function signIn(req, res) {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

//     // Perform sign-in logic
//     const providerGoogle = new GoogleAuthProvider();
//     signInWithPopup(auth, providerGoogle)
//       .then((result) => {
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential?.accessToken;
//         const user = result.user;
//         console.log(token);
//         console.log(user);
//         res.status(200).json({ success: true, token, user });
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         const email = error.email;
//         const credential = GoogleAuthProvider.credentialFromError(error);
//         res.status(400).json({ success: false, errorCode, errorMessage, email });
//       });
//   }

// export const signIn = () => {
//   try {
//     const providerGoogle = new GoogleAuthProvider();
//     signInWithPopup(auth, providerGoogle)
//       .then((result) => {
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential?.accessToken;
//         const user = result;
//         console.log(token);
//         console.log(user);
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         const email = error.email;
//         const credential = GoogleAuthProvider.credentialFromError(error);
//       });
//   } catch (error) {
//     console.error(error);
//   }
// };
