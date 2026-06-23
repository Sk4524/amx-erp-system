"use client";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getToken,
  getRole,
} from "../lib/session";

import { canAccess }
  from "../lib/auth";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const [authorized,
    setAuthorized] =
    useState(false);

  const [checking,
    setChecking] =
    useState(true);

  useEffect(() => {

    const token =
  getToken();

const role =
  getRole();
    // NOT LOGGED IN
    if (
      !token ||
      !role
    ) {

      router.push(
        "/login"
      );

      setChecking(
        false
      );

      return;
    }

    // ROLE ACCESS CHECK
    if (
      !canAccess(
        role,
        pathname
      )
    ) {

      router.push(
        "/"
      );

      setChecking(
        false
      );

      return;
    }
    // USER IS AUTHORIZED
    setAuthorized(
      true
    );

    setChecking(
      false
    );

  }, [
    pathname,
    router,
  ]);

  // PREVENT FLASH
  if (checking) {

    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#eef2f7]
    ">

        <div className="
        w-12
        h-12
        rounded-full
        border-4
        border-cyan-200
        border-t-cyan-600
        animate-spin
      " />

      </div>

    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}