import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    // 登入成功，取得 token、user
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log(token);
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode);
    console.log(errorMessage);
    console.log(credential);
  });

signOut(auth)
  .then(() => {
    // 登出成功
  })
  .catch((error) => {
    // error
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 已登入
    const uid = user.uid;
    console.log(uid);
  } else {
    // 未登入
  }
});
