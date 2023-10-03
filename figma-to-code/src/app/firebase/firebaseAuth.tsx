"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/firebase/firebase";
import { setLogin, setLogout } from "@/store/userSlice";

interface Payload {
  name: string | null;
  email: string | null;
  uid: string;
  photo?: string;
}

export default function FirebaseAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const payload: Payload = {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photo: user.photoURL ?? "",
        };
        dispatch(setLogin(payload));
      } else {
        dispatch(setLogout());
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return null;
}
