"use client";
import SignIn from "./component/signIn";

function Profile() {
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential?.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  return (
    <div>
      <SignIn />
      {/* <form className="flex flex-col m-10">
        <input
          placeholder="email"
          className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <input
          placeholder="password"
          className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          sign up
        </button>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          login
        </button>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          logout
        </button>
      </form> */}
    </div>
  );
}

export default Profile;
