import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "@/store/userSlice";

export default function Login() {
  const dispatch = useDispatch();

  const state = useSelector((state: any) => state.user);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  return (
    <div>
      {/* <img>picture</img> */}
      {/* <div>{`Name: ${state.profile.name}`}</div>
      <div>{`Email: ${state.profile.email}`}</div> */}
      <div>{name ? name : ""}</div>
      <div>{email ? email : ""}</div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
