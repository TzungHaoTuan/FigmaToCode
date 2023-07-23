import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function HeadShot() {
  const user = useSelector((state: any) => state.user);
  const isLogin = user.profile.login;
  return (
    <Link href="/profile">
      {isLogin ? (
        <div className=" w-[36px] h-[36px] border-2 border-white rounded-full overflow-hidden ml-16">
          <img src={user.profile.photo} className="" />
        </div>
      ) : (
        <div className=" ml-16">
          <div>Login</div>
        </div>
      )}
    </Link>
  );
}
