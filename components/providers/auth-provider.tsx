"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext } from "react";

type AuthContextType = {
  isAdmin: boolean;
  userId: string;
};

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  userId: "",
});

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const isAdmin = session?.user?.roles?.includes("admin") || false;
  const userId = session?.user?.id || "";

  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ isAdmin, userId }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
