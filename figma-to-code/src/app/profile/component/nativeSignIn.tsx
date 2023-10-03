import { Auth, signInWithEmailAndPassword } from "firebase/auth";

const nativeSignIn = async (auth: Auth, email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    }
  }
};

export default nativeSignIn;
