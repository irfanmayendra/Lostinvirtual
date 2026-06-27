"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="px-6 py-2.5 bg-gray-700 rounded-lg font-semibold text-gray-400 animate-pulse"
      >
        Loading...
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="text-sm">
            <p className="font-medium text-white">{session.user.name}</p>
            <p className="text-gray-400">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 border border-gray-700 hover:border-red-500 hover:text-red-400 rounded-lg font-semibold transition-all text-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("keycloak")}
      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
    >
      Login with Keycloak
    </button>
  );
}
