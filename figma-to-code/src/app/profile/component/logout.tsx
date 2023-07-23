import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "@/store/userSlice";

export default function Logout() {
  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";

    dispatch(
      setLogin({
        name: name,
        email: email,
      })
    );

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  };
  return (
    <div>
      <div>Name:</div>
      <input type="text" placeholder="name" ref={nameRef}></input>
      <div>Email:</div>
      <input type="text" placeholder="email" ref={emailRef}></input>
      <br></br>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
