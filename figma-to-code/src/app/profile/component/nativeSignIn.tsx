import { signInWithEmailAndPassword } from "firebase/auth";

const nativeSignIn = (auth: any, email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log("Sign In successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      throw error;
    });
};

export default nativeSignIn;
