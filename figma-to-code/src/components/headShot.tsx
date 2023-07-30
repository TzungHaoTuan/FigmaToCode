import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import isLogOutAvatar from "../app/images/user.png";

export default function HeadShot() {
  const user = useSelector((state: any) => state.user);
  const photo = user.profile.photo;
  const isLogin = user.profile.login;
  return (
    <Link href="/profile" onClick={() => console.log(user)}>
      {isLogin ? (
        <div className=" w-[36px] h-[36px] border-2 border-white rounded-full overflow-hidden ml-0 sm:ml-16">
          {photo ? (
            <img alt="user avatar" src={photo} />
          ) : (
            <Image
              alt="user avatar"
              src={isLogOutAvatar}
              width={36}
              height={36}
            />
          )}
        </div>
      ) : (
        <div className=" ml-16">
          <div>Login</div>
        </div>
      )}
    </Link>
  );
}
