import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const userAvatar = "../../images/userAvatar.png";
const nativeSignUp = (
  auth: any,
  name: string,
  email: string,
  password: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 註冊成功
      const user = userCredential.user;
      console.log("Sign Up successfully");
      console.log(user);
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: userAvatar,
      })
        .then(() => {
          console.log("Profile updated successfully");
        })
        .catch((error) => {
          // An error occurred while updating the profile
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    })
    .catch((error) => {
      // 註冊失敗
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};

export default nativeSignUp;
