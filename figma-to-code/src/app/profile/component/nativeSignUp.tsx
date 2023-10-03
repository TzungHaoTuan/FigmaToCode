import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const nativeSignUp = async (
  auth: Auth,
  name: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: name,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    }
  }
};

export default nativeSignUp;
