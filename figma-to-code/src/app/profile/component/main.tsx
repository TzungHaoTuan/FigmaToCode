import React from "react";

import { useSelector } from "react-redux";
import Login from "./login";
import Logout from "./logout";

export default function Main() {
  const state = useSelector((state: any) => state.user);

  return <div>{state.profile.login ? <Login /> : <Logout />}</div>;
}
