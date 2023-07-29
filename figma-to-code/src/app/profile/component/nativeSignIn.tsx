import { signInWithEmailAndPassword } from "firebase/auth";

const nativeSignIn = async (auth: any, email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log("Sign In successfully");
      return user;
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
